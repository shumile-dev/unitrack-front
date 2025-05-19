/**
 * Authentication helper functions
 */

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  const auth = localStorage.getItem('auth');
  return !!token && auth === 'true';
};

// Get the current authentication token
export const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

// Get the current user data
export const getCurrentUser = () => {
  try {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    return JSON.parse(userString);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Set up headers for authenticated requests
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Logout helper
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('auth');
  localStorage.removeItem('user');
};

// Debug authentication info
export const debugAuthInfo = () => {
  const token = getAuthToken();
  const user = getCurrentUser();
  const isAuth = isAuthenticated();
  
  console.group('Authentication Debug Info');
  console.log('Is authenticated:', isAuth);
  console.log('Token available:', !!token);
  console.log('Token preview:', token ? `${token.substring(0, 10)}...` : 'No token');
  console.log('User data:', user);
  console.groupEnd();
  
  return { isAuth, hasToken: !!token, user };
}; 