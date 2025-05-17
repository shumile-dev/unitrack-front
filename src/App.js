import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LostItems from "./pages/LostItems";
import FoundItems from "./pages/FoundItems";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import PostItem from "./pages/PostItem";
import AllItems from "./pages/AllItems";
import ItemDetail from "./pages/ItemDetail";
import MyPosts from "./pages/MyPosts";
import EditPost from "./pages/EditPost";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EditProfile from "./pages/EditProfile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminPosts from "./pages/AdminPosts";
import AdminUserForm from "./pages/AdminUserForm";
// Uncomment if you have framer-motion installed
// import PageTransition from "./components/PageTransition";

// CSS-based transition wrapper as fallback
const CssTransition = ({ children }) => {
  return <div className="page-transition">{children}</div>;
};

// Auth checker component
const RequireAuth = ({ children }) => {
  const isAuthenticated = localStorage.getItem("auth") === "true";
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login with current location as redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

// Admin role checker component
const RequireAdmin = ({ children }) => {
  const isAuthenticated = localStorage.getItem("auth") === "true";
  const location = useLocation();
  let isAdmin = false;
  
  try {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    isAdmin = userData.role === "admin";
  } catch (err) {
    console.error("Error parsing user data:", err);
    isAdmin = false;
  }

  if (!isAuthenticated) {
    // Redirect to login with current location as redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  if (!isAdmin) {
    // Redirect non-admin users to home
    return <Navigate to="/home" replace />;
  }

  return children;
};

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Public routes */}
          <Route path="/login" element={<CssTransition><Login /></CssTransition>} />
          <Route path="/signup" element={<CssTransition><Signup /></CssTransition>} />
          <Route path="/forgot-password" element={<CssTransition><ForgotPassword /></CssTransition>} />
          <Route path="/reset-password/:token" element={<CssTransition><ResetPassword /></CssTransition>} />
          
          {/* Routes accessible to non-logged in users */}
          <Route path="/home" element={<CssTransition><Home /></CssTransition>} />
          <Route path="/lost" element={<CssTransition><LostItems /></CssTransition>} />
          <Route path="/found" element={<CssTransition><FoundItems /></CssTransition>} />
          <Route path="/all" element={<CssTransition><AllItems /></CssTransition>} />
          <Route path="/item/:id" element={<CssTransition><ItemDetail /></CssTransition>} />
          
          {/* Protected routes */}
          <Route path="/profile" element={
            <RequireAuth>
              <CssTransition><Profile /></CssTransition>
            </RequireAuth>
          } />
          <Route path="/edit-profile" element={
            <RequireAuth>
              <CssTransition><EditProfile /></CssTransition>
            </RequireAuth>
          } />
          <Route path="/post" element={
            <RequireAuth>
              <CssTransition><PostItem /></CssTransition>
            </RequireAuth>
          } />
          <Route path="/my-posts" element={
            <RequireAuth>
              <CssTransition><MyPosts /></CssTransition>
            </RequireAuth>
          } />
          <Route path="/edit-post/:id" element={
            <RequireAuth>
              <CssTransition><EditPost /></CssTransition>
            </RequireAuth>
          } />
          
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <RequireAdmin>
              <CssTransition><AdminDashboard /></CssTransition>
            </RequireAdmin>
          } />
          <Route path="/admin/users" element={
            <RequireAdmin>
              <CssTransition><AdminUsers /></CssTransition>
            </RequireAdmin>
          } />
          <Route path="/admin/users/add" element={
            <RequireAdmin>
              <CssTransition><AdminUserForm /></CssTransition>
            </RequireAdmin>
          } />
          <Route path="/admin/users/edit/:id" element={
            <RequireAdmin>
              <CssTransition><AdminUserForm /></CssTransition>
            </RequireAdmin>
          } />
          <Route path="/admin/users/:id" element={
            <RequireAdmin>
              <CssTransition><Profile /></CssTransition>
            </RequireAdmin>
          } />
          <Route path="/admin/posts" element={
            <RequireAdmin>
              <CssTransition><AdminPosts /></CssTransition>
            </RequireAdmin>
          } />
          <Route path="/admin/posts/:id" element={
            <RequireAdmin>
              <CssTransition><ItemDetail /></CssTransition>
            </RequireAdmin>
          } />
          <Route path="/admin/posts/edit/:id" element={
            <RequireAdmin>
              <CssTransition><EditPost /></CssTransition>
            </RequireAdmin>
          } />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
