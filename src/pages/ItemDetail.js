import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";
import ClaimModal from '../components/ClaimModal';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claims, setClaims] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user ID from localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData._id) {
          throw new Error('User not logged in');
        }

        const [itemResponse, userResponse] = await Promise.all([
          axios.get(`http://localhost:5000/blog/${id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
          }),
          axios.get(`http://localhost:5000/users/${userData._id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
          })
        ]);

        console.log('Item Response:', itemResponse.data);
        console.log('User Response:', userResponse.data);

        // Check if we have the blog data in the correct structure
        const blogData = itemResponse.data.blog || itemResponse.data;
        setItem(blogData);
        setUserInfo(userResponse.data);

        // Debug the item data
        console.log('Blog Data Structure:', blogData);
        console.log('Phone Field:', blogData.phone);

        // Get the author ID, handling both string and object cases
        const authorId = blogData.author?._id || blogData.author;
        console.log('Author ID:', authorId);
        console.log('User ID:', userResponse.data._id);
        
        // If user is the author, fetch claims for this item
        if (authorId === userResponse.data._id) {
          try {
            const claimsResponse = await axios.get(`http://localhost:5000/claim/item/${id}`, {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
              withCredentials: true
            });
            console.log('Claims Response:', claimsResponse.data);
            setClaims(claimsResponse.data);
          } catch (claimError) {
            console.error('Error fetching claims:', claimError);
            // Don't set the main error state, just log the claims error
          }
        }
      } catch (error) {
        console.error('Error:', error.response || error);
        setError(error.response?.data?.message || 'Error fetching item details');
        toast.error(error.response?.data?.message || 'Error fetching item details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleClaimSubmitted = (newClaim) => {
    toast.success('Claim submitted successfully!');
  };

  const handleApproveClaim = async (claimId) => {
    try {
      await axios.put(`http://localhost:5000/claim/${claimId}/approve`, {}, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
        withCredentials: true
      });
      
      toast.success('Claim approved successfully!');
      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error approving claim');
    }
  };

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
  
  // Check if coordinates are valid numbers
  const hasValidCoordinates = 
    item.latitude !== undefined && 
    item.latitude !== null && 
    !isNaN(item.latitude) && 
    item.longitude !== undefined && 
    item.longitude !== null && 
    !isNaN(item.longitude);
  
  // Get the author ID, handling both string and object cases
  const authorId = item.author?._id || item.author;
  
  const canClaim = userInfo && 
                  authorId !== userInfo._id && 
                  !item.isResolved;

  const isAuthor = userInfo && 
                  authorId === userInfo._id;
  
  return (
    <div className="page-container item-detail-page">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Link to="/all" className="back-link">← Back to All Items</Link>
      
      <div className="item-header">
        <h1>{item.title}</h1>
        <div className="item-status-badges">
          <span className={`item-type-badge ${typeClass}`}>
            {item.type === 'lost' ? 'Lost Item' : 'Found Item'}
          </span>
          {item.isResolved && (
            <span className="resolved-badge">Resolved</span>
          )}
        </div>
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
                  <span className="metadata-value">{item.location || "Location not provided"}</span>
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
                  <span className="metadata-value">{item.reporter || "Anonymous"}</span>
                </div>
              </div>
              
              <div className="metadata-item">
                <div className="metadata-icon">📞</div>
                <div className="metadata-content">
                  <span className="metadata-label">Contact</span>
                  <span className="metadata-value">{item.phone || "No phone provided"}</span>
                </div>
              </div>
              
              {!hasValidCoordinates && (
                <div className="metadata-item">
                  <div className="metadata-icon">ℹ️</div>
                  <div className="metadata-content">
                    <span className="metadata-label">Map Status</span>
                    <span className="metadata-value">No coordinates available for mapping</span>
                  </div>
                </div>
              )}
            </div>

            {canClaim && (
              <button 
                className="claim-button submit-btn"
                onClick={() => setShowClaimModal(true)}
              >
                Submit Claim for this Item
              </button>
            )}

            {isAuthor && !item.isResolved && claims.length > 0 && (
              <div className="claims-section">
                <h3>Claims Received</h3>
                <div className="claims-list">
                  {claims.map(claim => (
                    <div key={claim._id} className="claim-card">
                      <div className="claim-info">
                        <p><strong>Name:</strong> {claim.claimantName}</p>
                        <p><strong>Phone:</strong> {claim.claimantPhone}</p>
                        <p><strong>Hints:</strong> {claim.claimHints}</p>
                      </div>
                      {claim.status === 'pending' && (
                        <button 
                          className="approve-button submit-btn"
                          onClick={() => handleApproveClaim(claim._id)}
                        >
                          Approve Claim
                        </button>
                      )}
                      <span className={`claim-status ${claim.status}`}>
                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {hasValidCoordinates && (
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
      
      {showClaimModal && (
        <ClaimModal 
          itemId={id}
          onClose={() => setShowClaimModal(false)}
          onClaimSubmitted={handleClaimSubmitted}
        />
      )}
    </div>
  );
};

export default ItemDetail; 