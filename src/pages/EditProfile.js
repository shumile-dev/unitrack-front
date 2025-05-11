import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    rollNumber: "",
    department: "",
    degree: "",
    semester: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem("user");
    const isAuth = localStorage.getItem("auth");

    if (!loggedInUser || !isAuth) {
      toast.error("Please login to edit your profile");
      navigate("/login");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        // Get the stored user data first
        const userData = JSON.parse(loggedInUser);
        
        // Fetch detailed user info from API
        const response = await axios.get(`http://localhost:5000/users/${userData._id}`);
        
        // Set form state with user data
        setUser({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          rollNumber: response.data.rollNumber || "",
          department: response.data.department || "",
          degree: response.data.degree || "",
          semester: response.data.semester || ""
        });

        // Set image preview if available
        if (response.data.profileImage) {
          setImagePreview(response.data.profileImage);
        }
        
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      // Create preview URL
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      const userId = loggedInUser._id;

      // Update user profile data
      const profileResponse = await axios.put(`http://localhost:5000/users/${userId}`, user);
      
      // If user uploaded a new profile image
      if (profileImage) {
        const formData = new FormData();
        formData.append('profileImage', profileImage);
        
        await axios.post(`http://localhost:5000/updateProfileImage/${userId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      // Update local storage user data
      localStorage.setItem("user", JSON.stringify({
        ...loggedInUser,
        ...user,
      }));

      toast.success("Profile updated successfully");
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMsg = err.response?.data?.message || "Failed to update profile";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user.name) {
    return (
      <div className="page-container">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="loading-spinner">Loading profile...</div>
      </div>
    );
  }

  if (error && !user.name) {
    return (
      <div className="page-container">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="profile-image-edit">
          <div className="profile-image-preview">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" />
            ) : (
              <div className="profile-image-placeholder">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
          <div className="profile-image-upload">
            <label htmlFor="profile-image">Change Profile Picture</label>
            <input
              type="file"
              id="profile-image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
            readOnly
          />
          <small>Email cannot be changed</small>
        </div>
        
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={user.phone}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Roll Number</label>
          <input
            type="text"
            name="rollNumber"
            value={user.rollNumber}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Department</label>
          <input
            type="text"
            name="department"
            value={user.department}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Degree Program</label>
          <input
            type="text"
            name="degree"
            value={user.degree}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Semester</label>
          <input
            type="text"
            name="semester"
            value={user.semester}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => navigate("/profile")} 
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile; 