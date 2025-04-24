import React from "react";
import "../styles/global.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to UniTrack 🚀</h1>
      <p className="home-subtitle">Find and recover lost items in your university!</p>
      
      <div className="buttons">
        <a href="/lost" className="btn btn-primary">View Lost Items</a>
        <a href="/found" className="btn btn-secondary">View Found Items</a>
      </div>
    </div>
  );
};

export default Home;
