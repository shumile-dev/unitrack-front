import React from "react";
import "../index.css";

// 'type' should be either 'found' or 'lost'
const Card = ({ type, title, description, image, location, date, reporter }) => {
  return (
    <div className={`${type}-card`}>
      <img src={image} alt={title} className={`${type}-img`} />
      <div className={`${type}-content`}>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className={`${type}-meta`}>
          <span>📍 {location}</span>
          <span>📅 {date}</span>
          <span>👤 {reporter}</span>
        </div>
      </div>
    </div>
  );
};

export default Card; 