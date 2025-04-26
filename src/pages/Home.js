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
      <div className="map-section">
        <h2 className="map-title">📍 Our Campus</h2>
        <div className="map-container">
          <span className="map-marker">📍</span>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3359.7701636302536!2d74.16228577465104!3d32.63894357372164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f03050c9a9403%3A0x547af0d30e96d8b!2sUniversity%20of%20Gujrat!5e0!3m2!1sen!2s!4v1745625851961!5m2!1sen!2s"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Home;
