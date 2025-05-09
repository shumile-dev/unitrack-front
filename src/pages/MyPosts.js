import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
        await axios.delete(`http://localhost:5000/blog/${id}`);
        toast.success("Post deleted successfully");
        // Update the posts list
        setPosts(posts.filter(post => post._id !== id));
      } catch (err) {
        console.error("Error deleting post:", err);
        toast.error("Failed to delete post");
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
        <h1>My Posts</h1>
        
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
                  <img 
                    src={post.photoPath.startsWith('http') ? post.photoPath : `http://localhost:5000/${post.photoPath}`} 
                    alt={post.title} 
                    className="post-image" 
                  />
                )}
                <div className="post-content">
                  <h3>{post.title}</h3>
                  <p className="post-type">{post.type}</p>
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
                    >
                      Delete
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