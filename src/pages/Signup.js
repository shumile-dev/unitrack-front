import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    rollNumber: "",
    semester: "",
    department: "",
    degree: ""
  });
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    rollNumber: "",
    semester: "",
    department: "",
    degree: ""
  });

  // Clear field error when user makes a change
  const clearFieldError = (field) => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (error) {
      setError("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  // Validate the form before submission
  const validateForm = () => {
    let valid = true;
    const newFieldErrors = { ...fieldErrors };
    
    // Validate name
    if (!form.name.trim()) {
      newFieldErrors.name = "Full name is required";
      valid = false;
    }
    
    // Validate email
    if (!form.email.trim()) {
      newFieldErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newFieldErrors.email = "Please enter a valid email address";
      valid = false;
    }
    
    // Validate password
    if (!form.password) {
      newFieldErrors.password = "Password is required";
      valid = false;
    } else if (form.password.length < 8) {
      newFieldErrors.password = "Password must be at least 8 characters";
      valid = false;
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(form.password)) {
      newFieldErrors.password = "Password must include letters and numbers";
      valid = false;
    }
    
    // Validate phone
    if (!form.phone) {
      newFieldErrors.phone = "Phone number is required";
      valid = false;
    } else if (!/^\d{10,11}$/.test(form.phone.replace(/[^0-9]/g, ''))) {
      newFieldErrors.phone = "Phone number must be 10-11 digits";
      valid = false;
    }
    
    // Validate roll number
    if (!form.rollNumber.trim()) {
      newFieldErrors.rollNumber = "Roll number is required";
      valid = false;
    }
    
    // Validate semester
    if (!form.semester.trim()) {
      newFieldErrors.semester = "Semester is required";
      valid = false;
    }
    
    // Validate department
    if (!form.department.trim()) {
      newFieldErrors.department = "Department is required";
      valid = false;
    }
    
    // Validate degree
    if (!form.degree.trim()) {
      newFieldErrors.degree = "Degree program is required";
      valid = false;
    }
    
    setFieldErrors(newFieldErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset all errors
    setError("");
    setFieldErrors({
      name: "",
      email: "",
      password: "",
      phone: "",
      rollNumber: "",
      semester: "",
      department: "",
      degree: ""
    });
    
    // Validate the form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost:5000/register", form, {
        timeout: 15000 // 15 second timeout
      });
      
      toast.success("Registration successful! Redirecting to profile page...");
      
      // Save user data in localStorage
      try {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("auth", "true");
        
        // Store the access token if available
        if (response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
        } else {
          // If no token is provided, use the user ID as a fallback (not ideal but maintains compatibility)
          localStorage.setItem("accessToken", response.data.user._id);
        }
      } catch (storageErr) {
        console.error("Error storing user data:", storageErr);
      }
      
      // Redirect after a short delay to see the toast
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      // Handle different types of errors
      if (err.response) {
        // The server responded with an error status
        const serverError = err.response.data.message || "Registration failed";
        setError(serverError);
        toast.error(serverError);
        
        // Check for field-specific errors
        if (err.response.data.errors) {
          const serverFieldErrors = {};
          Object.entries(err.response.data.errors).forEach(([key, value]) => {
            serverFieldErrors[key] = value.message || value;
          });
          setFieldErrors(prev => ({ ...prev, ...serverFieldErrors }));
        }
        
        // Handle specific common registration issues
        if (err.response.status === 409) {
          // Conflict - likely email already exists
          setFieldErrors(prev => ({ 
            ...prev, 
            email: "This email is already registered. Please use a different email or try to login."
          }));
        }
      } else if (err.request) {
        // The request was made but no response was received
        const networkError = "Network error. Please check your internet connection and try again.";
        setError(networkError);
        toast.error(networkError);
      } else {
        // Something happened in setting up the request
        const unknownError = "An unexpected error occurred. Please try again.";
        setError(unknownError);
        toast.error(unknownError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>Sign Up</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name:</label>
          <input 
            type="text" 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            required 
            disabled={loading}
            className={fieldErrors.name ? "input-error" : ""}
          />
          {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
        </div>
        
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            required 
            disabled={loading}
            className={fieldErrors.email ? "input-error" : ""}
          />
          {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input 
            type="password" 
            name="password" 
            value={form.password} 
            onChange={handleChange} 
            required 
            disabled={loading}
            className={fieldErrors.password ? "input-error" : ""}
          />
          {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
        </div>
        
        <div className="form-group">
          <label>Phone Number:</label>
          <input 
            type="tel" 
            name="phone" 
            value={form.phone} 
            onChange={handleChange} 
            required 
            disabled={loading}
            className={fieldErrors.phone ? "input-error" : ""}
            placeholder="e.g., 03001234567"
          />
          {fieldErrors.phone && <div className="field-error">{fieldErrors.phone}</div>}
        </div>
        
        <div className="form-group">
          <label>Roll Number:</label>
          <input 
            type="text" 
            name="rollNumber" 
            value={form.rollNumber} 
            onChange={handleChange} 
            required 
            disabled={loading}
            className={fieldErrors.rollNumber ? "input-error" : ""}
          />
          {fieldErrors.rollNumber && <div className="field-error">{fieldErrors.rollNumber}</div>}
        </div>
        
        <div className="form-group">
          <label>Semester:</label>
          <input 
            type="text" 
            name="semester" 
            value={form.semester} 
            onChange={handleChange} 
            required 
            disabled={loading}
            className={fieldErrors.semester ? "input-error" : ""}
          />
          {fieldErrors.semester && <div className="field-error">{fieldErrors.semester}</div>}
        </div>
        
        <div className="form-group">
          <label>Department:</label>
          <input 
            type="text" 
            name="department" 
            value={form.department} 
            onChange={handleChange} 
            required 
            disabled={loading}
            className={fieldErrors.department ? "input-error" : ""}
          />
          {fieldErrors.department && <div className="field-error">{fieldErrors.department}</div>}
        </div>
        
        <div className="form-group">
          <label>Degree Program:</label>
          <input 
            type="text" 
            name="degree" 
            value={form.degree} 
            onChange={handleChange} 
            required 
            disabled={loading}
            className={fieldErrors.degree ? "input-error" : ""}
          />
          {fieldErrors.degree && <div className="field-error">{fieldErrors.degree}</div>}
        </div>
        
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        
        <div className="form-footer">
          <p>Already have an account? <Link to="/login" className="login-link">Login here</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Signup; 