import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Email input, 2: OTP verification, 3: New password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [timerCount, setTimerCount] = useState(0);

  // Clear field error when user makes a change
  const clearFieldError = (field) => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (error) {
      setError("");
    }
  };

  // Email validation
  const validateEmail = () => {
    let valid = true;
    
    if (!email.trim()) {
      setFieldErrors(prev => ({ ...prev, email: "Email is required" }));
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setFieldErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
      valid = false;
    }
    
    return valid;
  };

  // OTP validation
  const validateOTP = () => {
    let valid = true;
    
    if (!otp.trim()) {
      setFieldErrors(prev => ({ ...prev, otp: "OTP is required" }));
      valid = false;
    } else if (!/^\d+$/.test(otp)) {
      setFieldErrors(prev => ({ ...prev, otp: "OTP should only contain numbers" }));
      valid = false;
    } else if (otp.length < 4 || otp.length > 6) {
      setFieldErrors(prev => ({ ...prev, otp: "OTP should be 4-6 digits" }));
      valid = false;
    }
    
    return valid;
  };

  // Password validation
  const validatePassword = () => {
    let valid = true;
    
    if (!newPassword) {
      setFieldErrors(prev => ({ ...prev, newPassword: "New password is required" }));
      valid = false;
    } else if (newPassword.length < 8) {
      setFieldErrors(prev => ({ ...prev, newPassword: "Password must be at least 8 characters" }));
      valid = false;
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(newPassword)) {
      setFieldErrors(prev => ({ ...prev, newPassword: "Password must include letters and numbers" }));
      valid = false;
    }
    
    if (!confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: "Please confirm your password" }));
      valid = false;
    } else if (newPassword !== confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      valid = false;
    }
    
    return valid;
  };

  // Start timer for resend OTP
  const startResendTimer = () => {
    setTimerCount(60);
    const interval = setInterval(() => {
      setTimerCount(prevCount => {
        if (prevCount <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setError("");
    setFieldErrors(prev => ({ ...prev, email: "" }));
    
    // Validate email
    if (!validateEmail()) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/forgot-password", { email }, {
        timeout: 10000 // 10 second timeout
      });
      
      toast.success(response.data.message || "OTP sent successfully to your email");
      setStep(2);
      startResendTimer();
    } catch (err) {
      handleApiError(err, "email");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setError("");
    setFieldErrors(prev => ({ ...prev, otp: "" }));
    
    // Validate OTP
    if (!validateOTP()) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/verify-otp", { email, otp }, {
        timeout: 10000
      });
      
      toast.success(response.data.message || "OTP verified successfully");
      setStep(3);
    } catch (err) {
      handleApiError(err, "otp");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setError("");
    setFieldErrors({
      newPassword: "",
      confirmPassword: ""
    });
    
    // Validate password
    if (!validatePassword()) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/reset-password", {
        email,
        otp,
        newPassword
      }, {
        timeout: 10000
      });
      
      toast.success(response.data.message || "Password reset successfully");
      
      // Clear form fields
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      
      // After successful password reset, redirect to login page after 3 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (err) {
      handleApiError(err, "newPassword");
    } finally {
      setLoading(false);
    }
  };

  // General error handler for API calls
  const handleApiError = (err, fieldName) => {
    if (err.response) {
      // Server responded with an error status
      const errorMsg = err.response.data.message || "An error occurred";
      setError(errorMsg);
      toast.error(errorMsg);
      
      // Set field-specific error if applicable
      if (fieldName && (errorMsg.toLowerCase().includes(fieldName) || 
          errorMsg.toLowerCase().includes("otp") || 
          errorMsg.toLowerCase().includes("email") || 
          errorMsg.toLowerCase().includes("password"))) {
        setFieldErrors(prev => ({ ...prev, [fieldName]: errorMsg }));
      }
      
      // Handle specific errors
      if (err.response.status === 404 && fieldName === "email") {
        setFieldErrors(prev => ({ ...prev, email: "Email not found. Please check your email or sign up." }));
      } else if (err.response.status === 400 && fieldName === "otp") {
        setFieldErrors(prev => ({ ...prev, otp: "Invalid or expired OTP. Please try again." }));
      }
    } else if (err.request) {
      // Request was made but no response received (network error)
      const networkError = "Unable to connect to the server. Please check your internet connection.";
      setError(networkError);
      toast.error(networkError);
    } else {
      // Error in request setup
      const unknownError = "An error occurred. Please try again.";
      setError(unknownError);
      toast.error(unknownError);
    }
  };

  return (
    <div className="form-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>Reset Password</h1>
      
      {error && <div className="error-message">{error}</div>}

      {step === 1 && (
        <form onSubmit={handleSendOTP}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              placeholder="Enter your registered email"
              required
              disabled={loading}
              className={fieldErrors.email ? "input-error" : ""}
            />
            {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
          <div className="form-footer">
            <Link to="/login">Back to Login</Link>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP}>
          <div className="form-group">
            <label>OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                clearFieldError("otp");
              }}
              placeholder="Enter OTP sent to your email"
              required
              disabled={loading}
              className={fieldErrors.otp ? "input-error" : ""}
            />
            {fieldErrors.otp && <div className="field-error">{fieldErrors.otp}</div>}
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <div className="form-footer">
            <button 
              type="button" 
              className="text-button" 
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Change Email
            </button>
            <button 
              type="button" 
              className="text-button" 
              onClick={handleSendOTP}
              disabled={loading || timerCount > 0}
            >
              {timerCount > 0 ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                clearFieldError("newPassword");
              }}
              placeholder="Enter new password"
              required
              disabled={loading}
              minLength="8"
              className={fieldErrors.newPassword ? "input-error" : ""}
            />
            {fieldErrors.newPassword && <div className="field-error">{fieldErrors.newPassword}</div>}
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearFieldError("confirmPassword");
              }}
              placeholder="Confirm new password"
              required
              disabled={loading}
              className={fieldErrors.confirmPassword ? "input-error" : ""}
            />
            {fieldErrors.confirmPassword && <div className="field-error">{fieldErrors.confirmPassword}</div>}
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword; 