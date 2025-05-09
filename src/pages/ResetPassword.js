import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Verify token is valid
    const verifyToken = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/verify-reset-token/${token}`);
        setTokenValid(true);
        setEmail(response.data.email);
      } catch (err) {
        console.error("Invalid or expired token:", err);
        toast.error("Invalid or expired reset link. Please request a new one.");
        setTimeout(() => {
          navigate("/forgot-password");
        }, 3000);
      }
    };

    verifyToken();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate password strength
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/reset-password-with-token", {
        token,
        newPassword
      });

      toast.success(response.data.message || "Password reset successfully");
      
      // Redirect to login after success
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Error resetting password:", err);
      toast.error(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="form-container">
        <ToastContainer position="top-right" autoClose={3000} />
        <h1>Password Reset</h1>
        <div className="message-container">
          <p>Verifying your reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>Reset Your Password</h1>
      <p className="reset-instructions">
        Please enter a new password for your account.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            required
            minLength="8"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword; 