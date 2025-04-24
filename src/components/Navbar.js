import React from "react";
import { NavLink, Link } from "react-router-dom";
import "../styles/global.css"; // CSS file include karni hai

const Navbar = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="logo">
          UniTrack
        </Link>
        <ul className="nav-links">
          <li>
            <NavLink to="/lost" className={({ isActive }) => (isActive ? 'active' : '')}>
              Lost Items
            </NavLink>
          </li>
          <li>
            <NavLink to="/found" className={({ isActive }) => (isActive ? 'active' : '')}>
              Found Items
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
              Contact
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
