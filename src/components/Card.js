import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

// 'type' should be either 'found' or 'lost'
const Card = ({ id, type, title, description, image, location, date, reporter }) => {
  return (
    <div className={`${type}-card`}>
      {id ? (
        <Link to={`/item/${id}`}>
          <img src={image} alt={title} className={`${type}-img`} />
        </Link>
      ) : (
        <img src={image} alt={title} className={`${type}-img`} />
      )}
      <div className={`${type}-content`}>
        <h2>
          {id ? <Link to={`/item/${id}`} className="card-title-link">{title}</Link> : title}
        </h2>
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