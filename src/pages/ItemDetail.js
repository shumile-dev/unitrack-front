import React from "react";
import { useParams, Link } from "react-router-dom";
import { allItems } from "../data/items";

const ItemDetail = () => {
  const { id } = useParams();
  const item = allItems.find(item => item.id === parseInt(id));

  if (!item) {
    return (
      <div className="page-container item-detail-page">
        <h2>Item not found</h2>
        <Link to="/all" className="back-link">← Back to All Items</Link>
      </div>
    );
  }

  return (
    <div className="page-container item-detail-page">
      <Link to="/all" className="back-link">← Back to All Items</Link>
      <div className="item-card-detail">
        <img src={item.image} alt={item.title} />
        <div className="item-info-detail">
          <h1>{item.title}</h1>
          <p>{item.description}</p>
          <ul className="item-meta-detail">
            <li><strong>Location:</strong> {item.location}</li>
            <li><strong>Date:</strong> {item.date}</li>
            <li><strong>Reporter:</strong> {item.reporter}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail; 