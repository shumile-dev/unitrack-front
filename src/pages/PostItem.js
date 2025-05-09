import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Fix Leaflet default icon path resolution
delete L.Icon.Default.prototype._getIconUrl;

// Merge default icon options
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetinaUrl,
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl
});

// Component to drop a pin on click and update location state
function LocationMarker({ onSelect }) {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");
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
  return position ? (
    <Marker position={position}>
      <Popup>{address || `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`}</Popup>
    </Marker>
  ) : null;
}

const PostItem = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("found");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationObj, setLocationObj] = useState({ lat: null, lng: null, address: "" });
  const [date, setDate] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [reporter, setReporter] = useState("");
  // Optional manual location override
  const [manualLocation, setManualLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get current user info to prefill reporter field
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setReporter(user.name || "");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
      const latitudeToSubmit = manualLocation.trim() ? null : 
        (locationObj.lat !== null ? Number(locationObj.lat) : null);
      
      const longitudeToSubmit = manualLocation.trim() ? null : 
        (locationObj.lng !== null ? Number(locationObj.lng) : null);
      
      // Get user ID for author field
      const user = JSON.parse(userInfo);
      
      const formData = new FormData();
      formData.append("type", type);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", addressToSubmit);
      
      // Only append latitude/longitude if they're not null
      if (latitudeToSubmit !== null) {
        formData.append("latitude", latitudeToSubmit);
      }
      
      if (longitudeToSubmit !== null) {
        formData.append("longitude", longitudeToSubmit);
      }
      
      formData.append("date", date);
      formData.append("reporter", reporter);
      formData.append("author", user._id); // Add author ID
      
      if (imageFile) {
        formData.append("photoPath", imageFile);
      }
      
      // Send FormData to backend using axios
      const response = await axios.post("http://localhost:5000/blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", response.data);
      toast.success("Item submitted successfully!");
      
      // Navigate after short delay to see the toast
      setTimeout(() => {
        navigate("/all");
      }, 2000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to submit item");
      toast.error(err.response?.data?.message || "Failed to submit item");
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
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="found">Found</option>
            <option value="lost">Lost</option>
          </select>
        </div>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows="4"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <MapContainer
            center={[32.6389, 74.1623]}
            zoom={15}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker onSelect={({ lat, lng, address }) => setLocationObj({ lat, lng, address })} />
          </MapContainer>
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
            onChange={e => setManualLocation(e.target.value)}
            placeholder="Or enter location manually"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Image File</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files[0])}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Reporter</label>
          <input
            type="text"
            value={reporter}
            onChange={e => setReporter(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default PostItem; 