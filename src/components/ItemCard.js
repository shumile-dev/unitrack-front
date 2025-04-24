import React from "react";
import "../styles/global.css";

const ItemCard = ({ title, description }) => {
  return (
    <div className="item-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default ItemCard;
