import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { debugAuthInfo, getAuthHeaders } from '../utils/authHelpers';

const ClaimModal = ({ itemId, onClose, onClaimSubmitted }) => {
  const [formData, setFormData] = useState({
    claimantName: '',
    claimantPhone: '',
    claimHints: ''
  });
  const [loading, setLoading] = useState(false);

  // Check auth on component mount
  useEffect(() => {
    // Debug authentication info
    console.log("Claim Modal Mounted - Debugging Auth:");
    const authInfo = debugAuthInfo();
    
    if (!authInfo.isAuth) {
      toast.error("You must be logged in to submit a claim");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Submitting claim for item:', itemId);
      
      // Debug token information
      const token = localStorage.getItem('accessToken');
      console.log('Access token available:', !!token);
      console.log('Token first 10 chars:', token ? token.substring(0, 10) + '...' : 'No token');
      console.log('User data:', localStorage.getItem('user'));
      
      const response = await axios.post('http://localhost:5000/claim', {
        ...formData,
        itemId
      }, {
        headers: getAuthHeaders(),
        withCredentials: true
      });

      toast.success('Claim submitted successfully!');
      onClaimSubmitted(response.data);
      onClose();
    } catch (error) {
      console.error('Claim submission error:', error);
      const errorMessage = error.response?.data?.message || 'Error submitting claim';
      toast.error(errorMessage);
      
      // Show more detailed error information
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
        
        if (error.response.status === 401) {
          console.error('Authentication failed - check if you are logged in properly');
          toast.error('Authentication failed - try logging out and back in');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Submit Claim</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              name="claimantName"
              value={formData.claimantName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="claimantPhone"
              value={formData.claimantPhone}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Hints/Description</label>
            <textarea
              name="claimHints"
              value={formData.claimHints}
              onChange={handleChange}
              rows="4"
              required
              disabled={loading}
              placeholder="Please provide details that prove this item belongs to you..."
            />
          </div>
          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimModal; 