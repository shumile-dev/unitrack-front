import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/admin.css';

const AdminPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);

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
      fetchPosts();
    }
  }, [navigate]);

  const fetchPosts = async () => {
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
      
      const response = await axios.get('http://localhost:5000/blog/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setPosts(response.data.blogs || response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      const errorMsg = err.response?.data?.message || 'Failed to load posts';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    
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
      
      await axios.delete(`http://localhost:5000/blog/${postToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success(`Post "${postToDelete.title}" deleted successfully`);
      setPosts(posts.filter(post => post._id !== postToDelete._id));
      setShowDeleteModal(false);
      setPostToDelete(null);
    } catch (err) {
      console.error('Error deleting post:', err);
      const errorMsg = err.response?.data?.message || 'Failed to delete post';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUnblock = async (post) => {
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
      
      // Since we don't have block/unblock endpoints in the regular API,
      // we'll use a PUT request to update the post status
      const updatedPost = {
        ...post,
        isBlocked: !post.isBlocked
      };
      
      const response = await axios.put(`http://localhost:5000/blog`, updatedPost, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update the post in the state
      setPosts(posts.map(p => 
        p._id === post._id ? { ...p, isBlocked: !p.isBlocked } : p
      ));
      
      toast.success(post.isBlocked 
        ? `Post "${post.title}" unblocked successfully`
        : `Post "${post.title}" blocked successfully`
      );
    } catch (err) {
      console.error('Error updating post status:', err);
      const errorMsg = err.response?.data?.message || 'Failed to update post status';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Filter posts based on search term and type filter
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.reporter?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = 
      filterType === 'all' || 
      (filterType === 'lost' && post.type === 'lost') ||
      (filterType === 'found' && post.type === 'found') ||
      (filterType === 'blocked' && post.isBlocked) ||
      (filterType === 'active' && !post.isBlocked);
      
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading && posts.length === 0) {
    return (
      <div className="admin-container">
        <div className="loading-spinner">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="admin-header">
        <h1 className="admin-title">Manage Posts</h1>
        <Link to="/admin/dashboard" className="admin-back-btn">
          Back to Dashboard
        </Link>
      </div>
      
      <div className="admin-controls">
        <div className="admin-search">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={handleSearch}
            className="admin-search-input"
          />
        </div>
        
        <div className="admin-filter">
          <select 
            value={filterType} 
            onChange={handleFilterChange}
            className="admin-filter-select"
          >
            <option value="all">All Posts</option>
            <option value="lost">Lost Items</option>
            <option value="found">Found Items</option>
            <option value="blocked">Blocked Posts</option>
            <option value="active">Active Posts</option>
          </select>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Reporter</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.length > 0 ? (
              currentPosts.map(post => (
                <tr key={post._id}>
                  <td>{post.title}</td>
                  <td>
                    <span className={`post-type ${post.type}`}>
                      {post.type}
                    </span>
                  </td>
                  <td>{post.reporter}</td>
                  <td>{new Date(post.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`post-status ${post.isBlocked ? 'blocked' : 'active'}`}>
                      {post.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="admin-actions">
                    <Link to={`/admin/posts/${post._id}`} className="admin-action-btn view">
                      View
                    </Link>
                    <Link to={`/admin/posts/edit/${post._id}`} className="admin-action-btn edit">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleBlockUnblock(post)}
                      className={`admin-action-btn ${post.isBlocked ? 'unblock' : 'block'}`}
                      disabled={loading}
                    >
                      {post.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      onClick={() => handleDeleteClick(post)}
                      className="admin-action-btn delete"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  {searchTerm || filterType !== 'all' 
                    ? 'No posts matching your search/filter' 
                    : 'No posts found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="admin-pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            &laquo; Prev
          </button>
          
          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next &raquo;
          </button>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Delete</h2>
            <p>
              Are you sure you want to delete post <strong>"{postToDelete?.title}"</strong>?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="modal-btn cancel">
                Cancel
              </button>
              <button onClick={confirmDelete} className="modal-btn delete" disabled={loading}>
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPosts; 