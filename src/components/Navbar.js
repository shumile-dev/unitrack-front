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
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/all" end className={({ isActive }) => (isActive ? 'active' : '')}>
              All Items
            </NavLink>
          </li>
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
          <li>
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
              Login
            </NavLink>
          </li>
          <li>
            <NavLink to="/signup" className={({ isActive }) => (isActive ? 'active' : '')}>
              Sign Up
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
