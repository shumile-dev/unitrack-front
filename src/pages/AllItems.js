import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { allItems } from "../data/items";

const AllItems = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState({ found: true, lost: true });
  const [sortOrder, setSortOrder] = useState("newest");

  const filteredItems = useMemo(() => {
    return allItems
      .filter(item => filterType[item.type])
      .filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [searchTerm, filterType, sortOrder]);

  return (
    <div className="page-container all-items-page">
      <div className="found-header-modern">
        <h1>📦 All Items</h1>
        <p>Browse all lost and found items. Use search and filters to narrow down.</p>
      </div>

      <div className="filter-controls">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={filterType.found}
            onChange={() => setFilterType(prev => ({ ...prev, found: !prev.found }))}
          />
          Found
        </label>
        <label>
          <input
            type="checkbox"
            checked={filterType.lost}
            onChange={() => setFilterType(prev => ({ ...prev, lost: !prev.lost }))}
          />
          Lost
        </label>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <div className="all-grid">
        {filteredItems.map(item => (
          <Link key={item.id} to={`/item/${item.id}`}>
            <Card type={item.type} {...item} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllItems; 