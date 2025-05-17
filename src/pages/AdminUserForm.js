import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/admin.css';

const AdminUserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    rollNumber: '',
    semester: '',
    department: '',
    degree: '',
    role: 'user' // Default role
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

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

    if (!checkAdminStatus()) return;

    // If in edit mode, fetch user data
    if (isEditMode) {
      fetchUser();
    }
  }, [id, navigate, isEditMode]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const adminUser = JSON.parse(localStorage.getItem('user'));
      
      const response = await axios.get(`http://localhost:5000/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${adminUser._id}`
        }
      });
      
      const userData = response.data;
      
      // Update form with user data, excluding password
      setForm({
        name: userData.name || '',
        email: userData.email || '',
        password: '', // Don't populate password
        phone: userData.phone || '',
        rollNumber: userData.rollNumber || '',
        semester: userData.semester || '',
        department: userData.department || '',
        degree: userData.degree || '',
        role: userData.role || 'user'
      });
    } catch (err) {
      console.error('Error fetching user:', err);
      const errorMsg = err.response?.data?.message || 'Failed to load user data';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate name
    if (!form.name.trim()) {
      errors.name = 'Name is required';
    }
    
    // Validate email
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'Email is invalid';
    }
    
    // Validate password (only required for new users)
    if (!isEditMode) {
      if (!form.password) {
        errors.password = 'Password is required';
      } else if (form.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      
      if (form.password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    } else if (form.password && form.password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate phone
    if (!form.phone) {
      errors.phone = 'Phone number is required';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear field error
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const adminUser = JSON.parse(localStorage.getItem('user'));
      
      // Prepare data
      const userData = { ...form };
      
      // If we're in edit mode and password is empty, remove it from the request
      if (isEditMode && !userData.password) {
        delete userData.password;
      }
      
      // For edit mode, send PUT request, otherwise POST
      const response = isEditMode 
        ? await axios.put(`http://localhost:5000/admin/users/${id}`, userData, {
            headers: {
              Authorization: `Bearer ${adminUser._id}`
            }
          })
        : await axios.post('http://localhost:5000/admin/users', userData, {
            headers: {
              Authorization: `Bearer ${adminUser._id}`
            }
          });
      
      toast.success(isEditMode 
        ? 'User updated successfully!' 
        : 'User created successfully!'
      );
      
      // Navigate back to users list after a short delay
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);
    } catch (err) {
      console.error('Error saving user:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError('Failed to save user data');
        toast.error('Failed to save user data');
      }
      
      // Handle field-specific errors
      if (err.response?.data?.errors) {
        setFieldErrors(prev => ({ ...prev, ...err.response.data.errors }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="admin-header">
        <h1 className="admin-title">
          {isEditMode ? 'Edit User' : 'Add New User'}
        </h1>
        <Link to="/admin/users" className="admin-back-btn">
          Back to Users
        </Link>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="admin-form-container">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                className={fieldErrors.name ? 'input-error' : ''}
              />
              {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                className={fieldErrors.email ? 'input-error' : ''}
              />
              {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">
                Password {isEditMode && '(Leave blank to keep current password)'}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                className={fieldErrors.password ? 'input-error' : ''}
              />
              {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) {
                    setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }
                }}
                disabled={loading}
                className={fieldErrors.confirmPassword ? 'input-error' : ''}
              />
              {fieldErrors.confirmPassword && <div className="field-error">{fieldErrors.confirmPassword}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                disabled={loading}
                className={fieldErrors.phone ? 'input-error' : ''}
              />
              {fieldErrors.phone && <div className="field-error">{fieldErrors.phone}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="rollNumber">Roll Number</label>
              <input
                type="text"
                id="rollNumber"
                name="rollNumber"
                value={form.rollNumber}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="semester">Semester</label>
              <input
                type="text"
                id="semester"
                name="semester"
                value={form.semester}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                name="department"
                value={form.department}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="degree">Degree</label>
              <input
                type="text"
                id="degree"
                name="degree"
                value={form.degree}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : (isEditMode ? 'Update User' : 'Create User')}
            </button>
            <Link to="/admin/users" className="cancel-btn">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUserForm; 