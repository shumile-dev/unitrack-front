import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if we should redirect after login
  const from = location.state?.from || "/home";

  // Try to load saved email if available
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password
      });

      // Handle successful login
      console.log("Login successful:", response.data);
      
      // Show success toast
      toast.success("Login successful!");
      
      // Save email for remember me
      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }
      
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("auth", "true"); // Ensure it's a string "true"
      
      // Redirect after a short delay for the toast to be visible
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
      setLoading(false);
      
      // Display appropriate error message
      if (err.response) {
        const errorMsg = err.response.data.message || "Invalid credentials";
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (err.request) {
        const errorMsg = "No response from server. Please try again later.";
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        const errorMsg = "An error occurred. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    }
  };

  return (
    <div className="form-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="auth-header">
        <h1>Welcome Back</h1>
        <p>Please login to your account to continue</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
            className="form-input"
          />
        </div>
        
        <div className="form-options">
          <div className="remember-me">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              disabled={loading}
            />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          
          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="submit-btn" 
          disabled={loading}
        >
          {loading ? (
            <span className="loading-spinner-small"></span>
          ) : (
            "Login"
          )}
        </button>
      </form>
      
      <div className="form-footer">
        <p>Don't have an account? <Link to="/signup" className="signup-link">Sign up here</Link></p>
      </div>
    </div>
  );
};

export default Login; 