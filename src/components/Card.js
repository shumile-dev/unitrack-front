import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../index.css";

// 'type' should be either 'found' or 'lost'
const Card = ({ id, type, title, description, image, location, date, reporter }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`${type}-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-decoration-dot"></div>
      
      {id ? (
        <Link to={`/item/${id}`} className="card-image-container">
          <img src={image} alt={title} className={`${type}-img`} />
          <div className="card-hover-overlay">
            <span>View Details →</span>
          </div>
        </Link>
      ) : (
        <div className="card-image-container">
          <img src={image} alt={title} className={`${type}-img`} />
        </div>
      )}
      
      <div className={`${type}-content`}>
        <h2>
          {id ? <Link to={`/item/${id}`} className="card-title-link">{title}</Link> : title}
        </h2>
        <p>{description}</p>
        <div className={`${type}-meta`}>
          <span className="meta-item"><i className="meta-icon location-icon">📍</i> {location}</span>
          <span className="meta-item"><i className="meta-icon date-icon">📅</i> {date}</span>
          <span className="meta-item"><i className="meta-icon user-icon">👤</i> {reporter}</span>
        </div>
      </div>
    </div>
  );
};

export default Card; 