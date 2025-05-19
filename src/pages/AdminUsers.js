import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/admin.css';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

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
      fetchUsers();
    }
  }, [navigate]);

  const fetchUsers = async () => {
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
      
      const response = await axios.get('http://localhost:5000/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUsers(response.data.users || response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      const errorMsg = err.response?.data?.message || 'Failed to load users';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
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
      
      // Use the DELETE endpoint
      await axios.delete(`http://localhost:5000/users/${userToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success(`User ${userToDelete.name} deleted successfully`);
      setUsers(users.filter(user => user._id !== userToDelete._id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      const errorMsg = err.response?.data?.message || 'Failed to delete user';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading && users.length === 0) {
    return (
      <div className="admin-container">
        <div className="loading-spinner">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="admin-header">
        <h1 className="admin-title">Manage Users</h1>
        <Link to="/admin/dashboard" className="admin-back-btn">
          Back to Dashboard
        </Link>
      </div>
      
      <div className="admin-controls">
        <div className="admin-search">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            className="admin-search-input"
          />
        </div>
        <Link to="/admin/users/add" className="admin-add-btn">
          Add New User
        </Link>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Roll Number</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.rollNumber}</td>
                  <td>
                    <span className={`user-role ${user.role || 'user'}`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="admin-actions">
                    <Link to={`/admin/users/${user._id}`} className="admin-action-btn view">
                      View
                    </Link>
                    <Link to={`/admin/users/edit/${user._id}`} className="admin-action-btn edit">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(user)}
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
                  {searchTerm ? 'No users matching your search' : 'No users found'}
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
              Are you sure you want to delete user <strong>{userToDelete?.name}</strong>?
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

export default AdminUsers; 