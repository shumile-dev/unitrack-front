import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PostItem = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("found");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [reporter, setReporter] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    const newItem = { type, title, description, location, date, image, reporter };
    console.log("New item posted:", newItem);
    alert("Item submitted! (console shows data)");
    // TODO: send data to backend or update state
    navigate("/all");
  };

  return (
    <div className="form-container">
      <h1>Post Item</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Category</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="found">Found</option>
            <option value="lost">Lost</option>
          </select>
        </div>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows="4"
            required
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="url"
            value={image}
            onChange={e => setImage(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Reporter</label>
          <input
            type="text"
            value={reporter}
            onChange={e => setReporter(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default PostItem; 