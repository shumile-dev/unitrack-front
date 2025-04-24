import React from "react";
import Card from "../components/Card";
import { foundItems } from "../data/items";

const FoundItems = () => {
  return (
    <div className="page-container found-items-modern">
      <div className="found-header-modern">
        <h1>🔍 Found Items</h1>
        <p>Track all found items reported in the university. If you've found something, check here.</p>
      </div>
      <div className="found-grid">
        {foundItems.map(item => (
          <Card key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default FoundItems;
