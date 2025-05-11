import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../index.css";

// 'type' should be either 'found' or 'lost'
const Card = ({ id, type, title, description, image, location, date, reporter }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format date to readable format
  const formattedDate = new Date(date).toLocaleDateString();
  
  // Truncate description if it's too long
  const truncatedDescription = description && description.length > 150
    ? `${description.substring(0, 150)}...`
    : description;
  
  return (
    <div 
      className={`${type}-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-decoration-dot"></div>
      
      <div className="card-image-container">
        {id ? (
          <Link to={`/item/${id}`}>
            <img 
              src={image} 
              alt={title} 
              className={`${type}-img`} 
            />
            <div className="card-hover-overlay">
              <span>View Details →</span>
            </div>
          </Link>
        ) : (
          <img 
            src={image} 
            alt={title} 
            className={`${type}-img`} 
          />
        )}
      </div>
      
      <div className={`${type}-content`}>
        <h2>
          {id ? <Link to={`/item/${id}`} className="card-title-link">{title}</Link> : title}
        </h2>
        <p>{truncatedDescription}</p>
        <div className={`${type}-meta`}>
          <span className="meta-item"><i className="meta-icon location-icon">📍</i> {location}</span>
          <span className="meta-item"><i className="meta-icon date-icon">📅</i> {formattedDate}</span>
          <span className="meta-item"><i className="meta-icon user-icon">👤</i> {reporter}</span>
        </div>
      </div>
    </div>
  );
};

export default Card; 