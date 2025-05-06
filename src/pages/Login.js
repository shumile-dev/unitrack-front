import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      toast.success("Login successful! Redirecting to your profile...");
      
      // Store user data in localStorage or context if needed
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("auth", true);
      
      // Redirect to profile page after a short delay for the toast to be visible
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      console.error("Login error:", err);
      
      // Display appropriate error message
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMsg = err.response.data.message || "Invalid credentials";
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (err.request) {
        // The request was made but no response was received
        const errorMsg = "No response from server. Please try again later.";
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        // Something happened in setting up the request that triggered an Error
        const errorMsg = "An error occurred. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>Login</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="form-footer">
        <p>Don't have an account? <a href="/signup">Sign up here</a></p>
      </div>
    </div>
  );
};

export default Login; 