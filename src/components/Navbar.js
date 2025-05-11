import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/global.css"; // CSS file include karni hai

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check login status whenever location changes or component mounts
  useEffect(() => {
    const checkAuthStatus = () => {
      const auth = localStorage.getItem("auth");
      setIsLoggedIn(auth === "true");
    };

    // Initial check
    checkAuthStatus();

    // Set up event listener for storage changes (in case another tab changes auth)
    window.addEventListener("storage", checkAuthStatus);

    // Clean up
    return () => {
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, [location]); // Re-check when location changes

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("auth");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Close mobile menu when clicking a link
  const closeMenu = () => {
    if (open) setOpen(false);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <Link to={isLoggedIn ? "/home" : "/"} className="logo">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiPHs3_6shinrriAGcaxOyv_Y8rqIuY4A4vio43hBKUjZJ7Lagdbagkko5GFomRfvTWbY&usqp=CAU" alt="Logo" className="logo-img" />
          Unitrack
        </Link>
        <div className="hamburger" onClick={() => setOpen(!open)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={`nav-links ${open ? "open" : ""}`}>
          <li onClick={closeMenu}>
            <NavLink to="/home" className={({ isActive }) => (isActive ? 'active' : '')}>
              Home
            </NavLink>
          </li>
          <li onClick={closeMenu}>
            <NavLink to="/all" className={({ isActive }) => (isActive ? 'active' : '')}>
              All Items
            </NavLink>
          </li>
          {isLoggedIn && (
            <li onClick={closeMenu}>
              <NavLink to="/post" className={({ isActive }) => (isActive ? 'active' : '')}>
                Post Item
              </NavLink>
            </li>
          )}
          <li onClick={closeMenu}>
            <NavLink to="/lost" className={({ isActive }) => (isActive ? 'active' : '')}>
              Lost Items
            </NavLink>
          </li>
          <li onClick={closeMenu}>
            <NavLink to="/found" className={({ isActive }) => (isActive ? 'active' : '')}>
              Found Items
            </NavLink>
          </li>
          
          {isLoggedIn ? (
            <>
              <li onClick={closeMenu}>
                <NavLink to="/my-posts" className={({ isActive }) => (isActive ? 'active' : '')}>
                  My Posts
                </NavLink>
              </li>
              <li onClick={closeMenu}>
                <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Profile
                </NavLink>
              </li>
              <li className="auth-links" onClick={closeMenu}>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className="auth-links" onClick={closeMenu}>
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
