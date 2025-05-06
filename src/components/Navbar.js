import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "../styles/global.css"; // CSS file include karni hai

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const auth = localStorage.getItem("auth");
    setIsLoggedIn(!!auth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("auth");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="logo">
          UniTrack
        </Link>
        <div className="hamburger" onClick={() => setOpen(!open)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={`nav-links ${open ? "open" : ""}`}>
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
            <NavLink to="/post" className={({ isActive }) => (isActive ? 'active' : '')}>
              Post Item
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
          
          {isLoggedIn ? (
            <>
              <li>
                <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Profile
                </NavLink>
              </li>
              <li className="auth-links">
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className="auth-links">
              <NavLink to="/login" className={({ isActive }) => (isActive ? 'active login-btn' : 'login-btn')}>
                Log in
              </NavLink>
              <NavLink to="/signup" className={({ isActive }) => (isActive ? 'active signup-btn' : 'signup-btn')}>
                Sign up
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
