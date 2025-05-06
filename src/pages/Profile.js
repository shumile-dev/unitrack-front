import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem("user");
    const isAuth = localStorage.getItem("auth");

    if (!loggedInUser || !isAuth) {
      toast.error("Please login to view your profile");
      navigate("/login");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        // Get the stored user data first
        const userData = JSON.parse(loggedInUser);
        setUser(userData); // Set initial user data from localStorage

        // Fetch detailed user info from API
        const response = await axios.get(`http://localhost:5000/users/${userData._id}`);
        
        // Update with more detailed information
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to load profile details");
        toast.error("Failed to load profile details");
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("auth");
    toast.info("You have been logged out");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="page-container">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="loading-spinner">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-image-container">
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="profile-image" />
            ) : (
              <div className="profile-image-placeholder">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
          <div className="profile-name-container">
            <h1>{user.name || "User"}</h1>
            <p className="profile-role">{user.role || "Student"}</p>
          </div>
        </div>

        <div className="profile-details">
          <h2>Personal Information</h2>
          <div className="profile-section">
            <div className="profile-item">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div className="profile-item">
              <label>Phone:</label>
              <span>{user.phone || "Not provided"}</span>
            </div>
          </div>

          <h2>Academic Information</h2>
          <div className="profile-section">
            <div className="profile-item">
              <label>Roll Number:</label>
              <span>{user.rollNumber || "Not provided"}</span>
            </div>
            <div className="profile-item">
              <label>Department:</label>
              <span>{user.department || "Not provided"}</span>
            </div>
            <div className="profile-item">
              <label>Degree Program:</label>
              <span>{user.degree || "Not provided"}</span>
            </div>
            <div className="profile-item">
              <label>Semester:</label>
              <span>{user.semester || "Not provided"}</span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="edit-profile-btn" onClick={() => navigate("/edit-profile")}>Edit Profile</button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 