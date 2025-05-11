import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// UOG coordinates
const UOG_COORDINATES = { lat: 32.6389, lng: 74.1623 };

// Fix Leaflet default icon path resolution
delete L.Icon.Default.prototype._getIconUrl;

// Merge default icon options
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetinaUrl,
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl
});

// Component to drop a pin on click and update location state
function LocationMarker({ onSelect, initialPosition }) {
  const [position, setPosition] = useState(initialPosition || null);
  const [address, setAddress] = useState("");
  
  // Set map view to initial position if provided
  const MapCenter = () => {
    const map = useMap();
    useEffect(() => {
      if (initialPosition) {
        map.setView([initialPosition.lat, initialPosition.lng], 15);
      }
    }, [map]);
    return null;
  };
  
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);
      // Reverse geocode selected coords to get address
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => {
          const displayName = data.display_name;
          setAddress(displayName);
          onSelect({ lat, lng, address: displayName });
        })
        .catch(err => {
          console.error('Reverse geocoding error:', err);
          onSelect({ lat, lng, address: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
        });
    }
  });
  
  return (
    <>
      <MapCenter />
      {position && (
        <Marker position={position}>
          <Popup>{address || `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`}</Popup>
        </Marker>
      )}
    </>
  );
}

// Custom Reset Button Control
function ResetButton() {
  const map = useMap();
  
  useEffect(() => {
    // Create custom control
    const resetControl = L.Control.extend({
      options: {
        position: 'topright'
      },
      
      onAdd: function() {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const button = L.DomUtil.create('button', '', container);
        
        button.innerHTML = 'Reset to UOG';
        button.style.padding = '8px 12px';
        button.style.backgroundColor = '#fff';
        button.style.border = '2px solid rgba(0,0,0,0.2)';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.fontWeight = 'bold';
        button.style.display = 'block';
        button.style.textAlign = 'center';
        
        // Important: Stop click events from propagating to the map
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);
        
        // Add click handler that doesn't trigger form submission
        L.DomEvent.on(button, 'click', function(ev) {
          L.DomEvent.preventDefault(ev);
          map.setView([UOG_COORDINATES.lat, UOG_COORDINATES.lng], 15);
        });
        
        return container;
      }
    });
    
    // Add the control to the map
    const control = new resetControl();
    control.addTo(map);
    
    // Cleanup on unmount
    return () => {
      control.remove();
    };
  }, [map]);
  
  return null; // No actual React component to render
}

const PostItem = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("found");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationObj, setLocationObj] = useState({ ...UOG_COORDINATES, address: "University of Gujarat" });
  const [date, setDate] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [reporter, setReporter] = useState("");
  // Optional manual location override
  const [manualLocation, setManualLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Field-specific errors
  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    reporter: "",
    image: ""
  });

  useEffect(() => {
    // Get current user info to prefill reporter field
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setReporter(user.name || "");
      } catch (err) {
        // Handle invalid JSON in localStorage
        console.error("Error parsing user data:", err);
        toast.error("Your login session appears to be corrupted. Please log in again.");
        localStorage.removeItem("user");
        localStorage.removeItem("auth");
        setTimeout(() => navigate("/login"), 1500);
      }
    }
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, [navigate]);

  // Clear field error when user makes a change
  const clearFieldError = (field) => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Validate the form before submission
  const validateForm = () => {
    let valid = true;
    const newFieldErrors = { ...fieldErrors };
    
    // Validate title
    if (!title.trim()) {
      newFieldErrors.title = "Title is required";
      valid = false;
    } else if (title.trim().length < 3) {
      newFieldErrors.title = "Title must be at least 3 characters";
      valid = false;
    } else if (title.trim().length > 100) {
      newFieldErrors.title = "Title must be less than 100 characters";
      valid = false;
    }
    
    // Validate description
    if (!description.trim()) {
      newFieldErrors.description = "Description is required";
      valid = false;
    } else if (description.trim().length < 10) {
      newFieldErrors.description = "Description must be at least 10 characters";
      valid = false;
    }
    
    // Validate location
    if (!manualLocation.trim() && (!locationObj.lat || !locationObj.lng)) {
      newFieldErrors.location = "Please select a location on the map or enter a manual location";
      valid = false;
    }
    
    // Validate date
    if (!date) {
      newFieldErrors.date = "Date is required";
      valid = false;
    }
    
    // Validate reporter
    if (!reporter.trim()) {
      newFieldErrors.reporter = "Reporter name is required";
      valid = false;
    }
    
    // Validate image
    if (!imageFile) {
      newFieldErrors.image = "Please upload an image";
      valid = false;
    } else if (imageFile.size > 5 * 1024 * 1024) { // 5MB limit
      newFieldErrors.image = "Image size must be less than 5MB";
      valid = false;
    }
    
    setFieldErrors(newFieldErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset all errors
    setError("");
    setFieldErrors({
      title: "",
      description: "",
      location: "",
      date: "",
      reporter: "",
      image: ""
    });
    
    // Validate the form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setLoading(true);

    try {
      // Check if user is logged in
      const userInfo = localStorage.getItem("user");
      if (!userInfo) {
        toast.error("Please log in to post an item");
        navigate("/login");
        return;
      }

      // Determine final location and coords
      const addressToSubmit = manualLocation.trim() || locationObj.address;
      
      // Ensure latitude and longitude are proper numbers or null
      // For both lost and found items, we'll use the coordinates from the map
      let latitudeToSubmit, longitudeToSubmit;
      
      if (manualLocation.trim()) {
        // If manual location is provided but we want coordinates, use default values
        latitudeToSubmit = UOG_COORDINATES.lat; // Default latitude
        longitudeToSubmit = UOG_COORDINATES.lng; // Default longitude
      } else {
        // Use selected coordinates from map
        latitudeToSubmit = locationObj.lat !== null ? Number(locationObj.lat) : UOG_COORDINATES.lat;
        longitudeToSubmit = locationObj.lng !== null ? Number(locationObj.lng) : UOG_COORDINATES.lng;
      }
      
      // Get user ID for author field
      let user;
      try {
        user = JSON.parse(userInfo);
      } catch (err) {
        toast.error("Your session is invalid. Please log in again.");
        navigate("/login");
        return;
      }
      
      const formData = new FormData();
      formData.append("type", type);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", addressToSubmit);
      
      // Always append latitude and longitude to ensure coordinates are saved
      formData.append("latitude", latitudeToSubmit);
      formData.append("longitude", longitudeToSubmit);
      
      formData.append("date", date);
      formData.append("reporter", reporter);
      
      if (!user._id) {
        toast.error("User ID not found. Please log in again.");
        navigate("/login");
        return;
      }
      
      formData.append("author", user._id); // Add author ID
      
      if (imageFile) {
        formData.append("photoPath", imageFile);
      }
      
      // Send FormData to backend using axios
      const response = await axios.post("http://localhost:5000/blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 10000 // 10 second timeout
      });

      toast.success("Item submitted successfully!");
      
      // Navigate after short delay to see the toast
      setTimeout(() => {
        navigate("/all");
      }, 2000);
    } catch (err) {
      // Handle different types of errors
      if (err.response) {
        // The server responded with an error status
        const serverError = err.response.data.message || "The server rejected your submission";
        setError(serverError);
        toast.error(serverError);
        
        // Check for field-specific errors from the server
        if (err.response.data.errors) {
          const serverFieldErrors = {};
          Object.entries(err.response.data.errors).forEach(([key, value]) => {
            serverFieldErrors[key] = value.message || value;
          });
          setFieldErrors(prev => ({ ...prev, ...serverFieldErrors }));
        }
      } else if (err.request) {
        // The request was made but no response was received
        const networkError = "Network error. Please check your internet connection and try again.";
        setError(networkError);
        toast.error(networkError);
      } else {
        // Something happened in setting up the request
        const unknownError = "An unexpected error occurred. Please try again.";
        setError(unknownError);
        toast.error(unknownError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>Post Item</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Category</label>
          <select 
            value={type} 
            onChange={e => setType(e.target.value)}
            disabled={loading}
          >
            <option value="found">Found</option>
            <option value="lost">Lost</option>
          </select>
        </div>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              clearFieldError("title");
            }}
            required
            disabled={loading}
            className={fieldErrors.title ? "input-error" : ""}
          />
          {fieldErrors.title && <div className="field-error">{fieldErrors.title}</div>}
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={e => {
              setDescription(e.target.value);
              clearFieldError("description");
            }}
            rows="4"
            required
            disabled={loading}
            className={fieldErrors.description ? "input-error" : ""}
          />
          {fieldErrors.description && <div className="field-error">{fieldErrors.description}</div>}
        </div>
        <div className="form-group">
          <label>Location {type === "lost" ? "(Where was it lost?)" : "(Where did you find it?)"}</label>
          <MapContainer
            center={[UOG_COORDINATES.lat, UOG_COORDINATES.lng]}
            zoom={15}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker 
              onSelect={({ lat, lng, address }) => {
                setLocationObj({ lat, lng, address });
                clearFieldError("location");
              }} 
              initialPosition={locationObj}
            />
            <ResetButton />
          </MapContainer>
          {fieldErrors.location && <div className="field-error">{fieldErrors.location}</div>}
        </div>
        <div className="form-group">
          <label>Geocoded Address</label>
          <input
            type="text"
            name="locationAddress"
            value={locationObj.address}
            readOnly
            placeholder="Selected address"
            required={!manualLocation.trim()}
            className={fieldErrors.location && !manualLocation.trim() ? "input-error" : ""}
          />
        </div>
        <div className="form-group">
          <label>Coordinates</label>
          <input
            type="text"
            name="coordinates"
            value={locationObj.lat != null && locationObj.lng != null
              ? `${locationObj.lat.toFixed(5)}, ${locationObj.lng.toFixed(5)}`
              : ""
            }
            readOnly
            placeholder="Latitude, Longitude"
            required={!manualLocation.trim()}
          />
        </div>
        <div className="form-group">
          <label>Manual Location (optional)</label>
          <input
            type="text"
            name="manualLocation"
            value={manualLocation}
            onChange={e => {
              setManualLocation(e.target.value);
              clearFieldError("location");
            }}
            placeholder="Or enter location manually"
            disabled={loading}
            className={fieldErrors.location && !locationObj.lat ? "input-error" : ""}
          />
        </div>
        <div className="form-group">
          <label>Date {type === "lost" ? "Lost" : "Found"}</label>
          <input
            type="date"
            value={date}
            onChange={e => {
              setDate(e.target.value);
              clearFieldError("date");
            }}
            required
            disabled={loading}
            className={fieldErrors.date ? "input-error" : ""}
          />
          {fieldErrors.date && <div className="field-error">{fieldErrors.date}</div>}
        </div>
        <div className="form-group">
          <label>Image File</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => {
              setImageFile(e.target.files[0]);
              clearFieldError("image");
            }}
            required
            disabled={loading}
            className={fieldErrors.image ? "input-error" : ""}
          />
          {fieldErrors.image && <div className="field-error">{fieldErrors.image}</div>}
        </div>
        <div className="form-group">
          <label>Reporter</label>
          <input
            type="text"
            value={reporter}
            onChange={e => {
              setReporter(e.target.value);
              clearFieldError("reporter");
            }}
            required
            disabled={loading}
            className={fieldErrors.reporter ? "input-error" : ""}
          />
          {fieldErrors.reporter && <div className="field-error">{fieldErrors.reporter}</div>}
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default PostItem; 