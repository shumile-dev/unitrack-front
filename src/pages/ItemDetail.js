import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/blog/${id}`);
        
        if (response.data && (response.data.blog || response.data)) {
          // Handle both response formats
          const itemData = response.data.blog || response.data;
          setItem(itemData);
        } else {
          setError("Item data structure is unexpected");
        }
      } catch (err) {
        console.error("Error fetching item details:", err);
        setError("Failed to load item details");
        toast.error("Failed to load item details");
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container item-detail-page">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading item details...</div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="page-container item-detail-page">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="error-message">{error || "Item not found"}</div>
        <Link to="/all" className="back-link">← Back to All Items</Link>
      </div>
    );
  }

  // Format the date for display
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Determine item type badge color
  const typeClass = item.type === 'lost' ? 'lost-badge' : 'found-badge';
  
  return (
    <div className="page-container item-detail-page">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Link to="/all" className="back-link">← Back to All Items</Link>
      
      <div className="item-header">
        <h1>{item.title}</h1>
        <span className={`item-type-badge ${typeClass}`}>
          {item.type === 'lost' ? 'Lost Item' : 'Found Item'}
        </span>
      </div>

      <div className="item-content">
        <div className="item-main-content">
          <div className="item-image-container">
            {item.photoPath && (
              <img 
                src={item.photoPath.startsWith('http') 
                  ? item.photoPath 
                  : `http://localhost:5000/${item.photoPath}`} 
                alt={item.title} 
                className="item-image"
              />
            )}
          </div>
          
          <div className="item-details">
            <div className="item-description">
              <h2>Description</h2>
              <p>{item.description}</p>
            </div>
            
            <div className="item-metadata">
              <div className="metadata-item">
                <div className="metadata-icon">📍</div>
                <div className="metadata-content">
                  <span className="metadata-label">Location</span>
                  <span className="metadata-value">{item.location}</span>
                </div>
              </div>
              
              <div className="metadata-item">
                <div className="metadata-icon">📅</div>
                <div className="metadata-content">
                  <span className="metadata-label">Date</span>
                  <span className="metadata-value">{formattedDate}</span>
                </div>
              </div>
              
              <div className="metadata-item">
                <div className="metadata-icon">👤</div>
                <div className="metadata-content">
                  <span className="metadata-label">Reporter</span>
                  <span className="metadata-value">{item.reporter}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {(item.latitude && item.longitude) && (
          <div className="item-map-container">
            <h2>Item Location</h2>
            <MapContainer 
              center={[item.latitude, item.longitude]} 
              zoom={15} 
              className="item-map"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[item.latitude, item.longitude]}>
                <Popup>{item.location || "Item Location"}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>
      
      <div className="item-actions">
        <Link to="/all" className="item-button primary-button">
          Browse More Items
        </Link>
        <Link to={item.type === 'lost' ? "/lost" : "/found"} className="item-button secondary-button">
          See Other {item.type === 'lost' ? 'Lost' : 'Found'} Items
        </Link>
      </div>
    </div>
  );
};

export default ItemDetail; 