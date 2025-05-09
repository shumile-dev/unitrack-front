import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        // Get user info from localStorage
        const userInfo = localStorage.getItem("user");
        
        if (!userInfo) {
          toast.error("Please log in to view your posts");
          navigate("/login");
          return;
        }
        
        const user = JSON.parse(userInfo);
        
        // Fetch posts by the current user
        const response = await axios.get(`http://localhost:5000/blogs/author/${user._id}`);
        
        // Check the structure of the response data and update accordingly
        console.log("API Response:", response.data);
        
        // If response.data is an object with a blogs property that contains the array
        if (response.data && response.data.blogs && Array.isArray(response.data.blogs)) {
          setPosts(response.data.blogs);
        } 
        // If response.data itself is the array
        else if (Array.isArray(response.data)) {
          setPosts(response.data);
        } 
        // Default to empty array if neither format matches
        else {
          console.error("Unexpected API response format:", response.data);
          setPosts([]);
          setError("Received unexpected data format from the server");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user posts:", err);
        setError("Failed to load your posts");
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        setDeleteLoading(true);
        
        // Check if user is authenticated
        const isAuthenticated = localStorage.getItem("auth") === "true";
        
        if (!isAuthenticated) {
          toast.error("You must be logged in to delete posts");
          navigate("/login");
          return;
        }
        
        // Get user info for the request
        const userInfo = localStorage.getItem("user");
        if (!userInfo) {
          toast.error("User information not found");
          return;
        }
        
        const user = JSON.parse(userInfo);
        
        // Make the API call
        await axios.delete(`http://localhost:5000/blog/${id}`);
        
        // Update the UI after successful deletion
        setPosts(prevPosts => prevPosts.filter(post => post._id !== id));
        toast.success("Post deleted successfully");
      } catch (err) {
        console.error("Error deleting post:", err);
        
        // If we got a 401 Unauthorized error, the auth middleware is still looking for cookies
        if (err.response && err.response.status === 401) {
          toast.error("Authentication issue. Please try logging out and logging in again.");
        } else {
          toast.error(err.response?.data?.message || "Failed to delete post");
        }
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="loading-spinner">Loading your posts...</div>
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
      <div className="my-posts-container">
        <div className="found-header-modern">
          <h1>📝 My Posts</h1>
          <p>Manage all your lost and found item posts</p>
        </div>
        
        {posts.length === 0 ? (
          <div className="no-posts-message">
            <p>You haven't created any posts yet.</p>
            <Link to="/post" className="create-post-btn">Create a Post</Link>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post._id} className="post-card">
                {post.photoPath && (
                  <div className="card-image-container">
                    <img 
                      src={post.photoPath.startsWith('http') ? post.photoPath : `http://localhost:5000/${post.photoPath}`} 
                      alt={post.title} 
                      className="post-image" 
                    />
                  </div>
                )}
                <div className="post-content">
                  <h3>{post.title}</h3>
                  <p className="post-type">{post.type === 'lost' ? 'Lost Item' : 'Found Item'}</p>
                  <p className="post-location">{post.location}</p>
                  <p className="post-date">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                  <div className="post-actions">
                    <Link to={`/item/${post._id}`} className="view-btn">
                      View
                    </Link>
                    <Link to={`/edit-post/${post._id}`} className="edit-btn">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="delete-btn"
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts; 