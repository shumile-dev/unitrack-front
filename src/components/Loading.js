import React from 'react';

const Loading = ({ type = 'default', count = 3 }) => {
  if (type === 'card') {
    return (
      <div className="loading-card">
        <div className="loading-skeleton loading-img"></div>
        <div className="loading-skeleton loading-title"></div>
        <div className="loading-skeleton loading-desc"></div>
        <div className="loading-skeleton loading-desc-short"></div>
      </div>
    );
  }

  if (type === 'grid') {
    return (
      <div className="loading-grid">
        {[...Array(count)].map((_, i) => (
          <div className="loading-card" key={i}>
            <div className="loading-skeleton loading-img"></div>
            <div className="loading-skeleton loading-title"></div>
            <div className="loading-skeleton loading-desc"></div>
            <div className="loading-skeleton loading-desc-short"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default Loading; 