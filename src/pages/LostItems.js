import React from "react";
import Card from "../components/Card";
import { lostItems } from "../data/items";

const LostItems = () => {
  return (
    <div className="page-container lost-items-modern">
      <div className="lost-header-modern">
        <h1>🥲 Lost Items</h1>
        <p>Browse all lost items reported in the university. Hoping someone finds them!</p>
      </div>
      <div className="lost-grid">
        {lostItems.map(item => (
          <Card key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default LostItems;
