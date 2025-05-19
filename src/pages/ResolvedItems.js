import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Card from '../components/Card';

const ResolvedItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResolvedItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/blog/resolved', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setItems(response.data);
      } catch (error) {
        toast.error('Error fetching resolved items');
      } finally {
        setLoading(false);
      }
    };

    fetchResolvedItems();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading resolved items...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container resolved-items-modern">
      <div className="resolved-header-modern">
        <h1>✅ Resolved Items</h1>
        <p>Items that have been successfully returned to their owners.</p>
      </div>
      {items.length === 0 ? (
        <div className="no-items-message">
          <p>No resolved items yet.</p>
        </div>
      ) : (
        <div className="resolved-grid">
          {items.map(item => (
            <Card 
              key={item._id} 
              {...item} 
              isResolved={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResolvedItems; 