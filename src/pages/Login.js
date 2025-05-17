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
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: ""
  });
  const [connectionError, setConnectionError] = useState(false);

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

  // Clear field error when user makes a change
  const clearFieldError = (field) => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (error) {
      setError("");
    }
    if (connectionError) {
      setConnectionError(false);
    }
  };

  // Validate the form before submission
  const validateForm = () => {
    let valid = true;
    const newFieldErrors = { ...fieldErrors };
    
    // Validate email
    if (!email.trim()) {
      newFieldErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newFieldErrors.email = "Please enter a valid email address";
      valid = false;
    }
    
    // Validate password
    if (!password) {
      newFieldErrors.password = "Password is required";
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
      email: "",
      password: ""
    });
    setConnectionError(false);
    
    // Validate the form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password
      }, {
        timeout: 10000 // 10 second timeout
      });

      // Handle successful login
      // Show success toast
      toast.success("Login successful!");
      
      // Save email for remember me
      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }
      
      // Store user data and tokens in localStorage
      try {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("auth", "true"); // Ensure it's a string "true"
        
        // Store the access token if available
        if (response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
        } else {
          // If no token is provided, use the user ID as a fallback (not ideal but maintains compatibility)
          localStorage.setItem("accessToken", response.data.user._id);
        }
      } catch (storageErr) {
        console.error("Error storing user data:", storageErr);
        // Continue login process even if storage fails
      }
      
      // Redirect after a short delay for the toast to be visible
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (err) {
      setLoading(false);
      
      // Display appropriate error message
      if (err.response) {
        // Server responded with an error status
        const errorMsg = err.response.data.message || "Invalid credentials";
        setError(errorMsg);
        toast.error(errorMsg);
        
        // Check for specific field errors
        if (err.response.status === 400) {
          if (errorMsg.toLowerCase().includes("email")) {
            setFieldErrors(prev => ({ ...prev, email: errorMsg }));
          } else if (errorMsg.toLowerCase().includes("password")) {
            setFieldErrors(prev => ({ ...prev, password: errorMsg }));
          }
        }
        
        // Rate limiting or too many attempts
        if (err.response.status === 429) {
          toast.error("Too many login attempts. Please try again later.");
        }
        
        // If server returns field-specific validation errors
        if (err.response.data.errors) {
          const serverFieldErrors = {};
          Object.entries(err.response.data.errors).forEach(([key, value]) => {
            serverFieldErrors[key] = value.message || value;
          });
          setFieldErrors(prev => ({ ...prev, ...serverFieldErrors }));
        }
      } else if (err.request) {
        // Request was made but no response received (network error)
        setConnectionError(true);
        const networkError = "Unable to connect to the server. Please check your internet connection.";
        setError(networkError);
        toast.error(networkError);
      } else {
        // Error in request setup
        const unknownError = "An error occurred during login. Please try again.";
        setError(unknownError);
        toast.error(unknownError);
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
      {connectionError && (
        <div className="connection-error">
          <p>Unable to connect to the server. Please:</p>
          <ul>
            <li>Check your internet connection</li>
            <li>Make sure the server is running</li>
            <li>Try again in a few moments</li>
          </ul>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
            }}
            placeholder="Enter your email"
            required
            disabled={loading}
            className={`form-input ${fieldErrors.email ? "input-error" : ""}`}
          />
          {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearFieldError("password");
            }}
            placeholder="Enter your password"
            required
            disabled={loading}
            className={`form-input ${fieldErrors.password ? "input-error" : ""}`}
          />
          {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
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