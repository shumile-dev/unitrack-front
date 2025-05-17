import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    usersCount: 0,
    postsCount: 0,
    lostItemsCount: 0,
    foundItemsCount: 0,
    blockedPostsCount: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is admin
    const checkAdminStatus = () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user || user.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        navigate('/');
        return false;
      }
      return true;
    };

    if (checkAdminStatus()) {
      fetchDashboardData();
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Get the stored user object
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Get the access token or use user._id as fallback
      let token = localStorage.getItem('accessToken');
      if (!token && user && user._id) {
        token = user._id;
      }
      
      if (!token) {
        throw new Error('No authentication token available. Please login again.');
      }
      
      // Since we don't have a dedicated stats endpoint, we'll make separate API calls
      // and aggregate the data ourselves
      
      // Get all users
      const usersResponse = await axios.get('http://localhost:5000/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Get all posts
      const postsResponse = await axios.get('http://localhost:5000/blog/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const users = usersResponse.data.users || usersResponse.data || [];
      const posts = postsResponse.data.blogs || postsResponse.data || [];
      
      // Calculate stats
      const usersCount = users.length;
      const postsCount = posts.length;
      const lostItemsCount = posts.filter(post => post.type === 'lost').length;
      const foundItemsCount = posts.filter(post => post.type === 'found').length;
      const blockedPostsCount = posts.filter(post => post.isBlocked).length;
      
      // Get recent users and posts
      const recentUsers = users.slice(0, 5); // Get first 5 users
      const recentPosts = posts.slice(0, 5); // Get first 5 posts
      
      setStats({
        usersCount,
        postsCount,
        lostItemsCount,
        foundItemsCount,
        blockedPostsCount
      });
      
      setRecentUsers(recentUsers);
      setRecentPosts(recentPosts);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      const errorMsg = err.response?.data?.message || 'Failed to load dashboard data';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-spinner">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchDashboardData} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h1 className="admin-title">Admin Dashboard</h1>
      
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <h3>Total Users</h3>
          <div className="stat-value">{stats.usersCount}</div>
          <Link to="/admin/users" className="stat-link">Manage Users</Link>
        </div>
        
        <div className="admin-stat-card">
          <h3>Total Posts</h3>
          <div className="stat-value">{stats.postsCount}</div>
          <Link to="/admin/posts" className="stat-link">Manage Posts</Link>
        </div>
        
        <div className="admin-stat-card">
          <h3>Lost Items</h3>
          <div className="stat-value">{stats.lostItemsCount}</div>
        </div>
        
        <div className="admin-stat-card">
          <h3>Found Items</h3>
          <div className="stat-value">{stats.foundItemsCount}</div>
        </div>
        
        <div className="admin-stat-card">
          <h3>Blocked Posts</h3>
          <div className="stat-value">{stats.blockedPostsCount}</div>
        </div>
      </div>
      
      <div className="admin-sections">
        <div className="admin-section">
          <h2>Recent Users</h2>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length > 0 ? (
                  recentUsers.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role || 'user'}</td>
                      <td>
                        <Link to={`/admin/users/${user._id}`} className="admin-action-btn view">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Link to="/admin/users" className="admin-view-all">
            View All Users
          </Link>
        </div>
        
        <div className="admin-section">
          <h2>Recent Posts</h2>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.length > 0 ? (
                  recentPosts.map(post => (
                    <tr key={post._id}>
                      <td>{post.title}</td>
                      <td>
                        <span className={`post-type ${post.type}`}>
                          {post.type}
                        </span>
                      </td>
                      <td>{post.author?.name || 'Unknown'}</td>
                      <td>
                        <span className={`post-status ${post.isBlocked ? 'blocked' : 'active'}`}>
                          {post.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td>
                        <Link to={`/admin/posts/${post._id}`} className="admin-action-btn view">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No posts found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Link to="/admin/posts" className="admin-view-all">
            View All Posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 