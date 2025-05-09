import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

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

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
      // Reverse geocode the initial position
      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${initialPosition.lat}&lon=${initialPosition.lng}`)
        .then(res => res.json())
        .then(data => {
          const displayName = data.display_name;
          setAddress(displayName);
        })
        .catch(err => {
          console.error('Reverse geocoding error:', err);
        });
    }
  }, [initialPosition]);

  // Set map center to the initial position
  const MapCenter = () => {
    const map = useMap();
    useEffect(() => {
      if (initialPosition) {
        map.setView([initialPosition.lat, initialPosition.lng], 15);
      }
    }, [map]);
    return null;
  };

  const mapEvents = useMapEvents({
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

const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [post, setPost] = useState({
    type: "",
    title: "",
    description: "",
    location: "",
    date: "",
    reporter: ""
  });
  const [locationObj, setLocationObj] = useState({ lat: null, lng: null, address: "" });
  const [manualLocation, setManualLocation] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/blog/${id}`);
        const postData = response.data;
        
        setPost({
          type: postData.type || "",
          title: postData.title || "",
          description: postData.description || "",
          location: postData.location || "",
          date: postData.date ? postData.date.split('T')[0] : "",
          reporter: postData.reporter || ""
        });

        if (postData.latitude && postData.longitude) {
          setLocationObj({
            lat: postData.latitude,
            lng: postData.longitude,
            address: postData.location || ""
          });
        } else {
          setManualLocation(postData.location || "");
        }

        if (postData.photoPath) {
          setCurrentImage(`http://localhost:5000/${postData.photoPath}`);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post details");
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Determine final location and coords
      const addressToSubmit = manualLocation.trim() || locationObj.address;
      const latitudeToSubmit = manualLocation.trim() ? null : locationObj.lat;
      const longitudeToSubmit = manualLocation.trim() ? null : locationObj.lng;
      
      const formData = new FormData();
      formData.append("id", id);
      formData.append("type", post.type);
      formData.append("title", post.title);
      formData.append("description", post.description);
      formData.append("location", addressToSubmit);
      formData.append("latitude", latitudeToSubmit);
      formData.append("longitude", longitudeToSubmit);
      formData.append("date", post.date);
      formData.append("reporter", post.reporter);
      
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.put(`http://localhost:5000/blog`, formData);
      toast.success("Post updated successfully");
      navigate("/my-posts");
    } catch (err) {
      console.error("Error updating post:", err);
      toast.error("Failed to update post");
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="loading-spinner">Loading post details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Category</label>
          <select 
            name="type" 
            value={post.type} 
            onChange={handleChange}
          >
            <option value="found">Found</option>
            <option value="lost">Lost</option>
          </select>
        </div>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={post.description}
            onChange={handleChange}
            rows="4"
            required
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
            <LocationMarker 
              onSelect={({ lat, lng, address }) => setLocationObj({ lat, lng, address })} 
              initialPosition={locationObj.lat && locationObj.lng ? locationObj : null}
            />
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
            onChange={(e) => setManualLocation(e.target.value)}
            placeholder="Or enter location manually"
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={post.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Current Image</label>
          {currentImage && (
            <img 
              src={currentImage} 
              alt="Current" 
              className="current-image-preview" 
              style={{ maxWidth: "200px", marginBottom: "10px" }}
            />
          )}
        </div>
        <div className="form-group">
          <label>Change Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
        <div className="form-group">
          <label>Reporter</label>
          <input
            type="text"
            name="reporter"
            value={post.reporter}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">Update Post</button>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => navigate("/my-posts")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost; 