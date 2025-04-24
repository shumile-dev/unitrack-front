import React from "react";
import "../styles/global.css"; // CSS file include karni hai

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">UniTrack</div>
      <ul className="nav-links">
        <li><a href="src/pages/Home.js">Home</a></li>
        <li><a href="src/pages/LostItems.js">Lost Items</a></li>
        <li><a href="src/pages/FoundItems.js">Found Items</a></li>
        <li><a href="src/pages/contact.js">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
