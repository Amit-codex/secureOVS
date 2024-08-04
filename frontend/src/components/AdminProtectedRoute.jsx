import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const AdminProtectedRoute = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null means loading

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/checkAuth', { withCredentials: true });
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        const userRole = token ? jwtDecode(token.split('=')[1]).role : null;

        if (response.status === 200 && userRole === 'admin') {
          setIsAuthenticated(true); // Authenticated as admin
        } else {
          setIsAuthenticated(false); // Not authenticated as admin
        }
      } catch (error) {
        setIsAuthenticated(false); // Not authenticated
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Waiting for authentication check
    return <div>Loading...</div>;
  }

  if (isAuthenticated === false) {
    // Not authenticated or not an admin
    return <Navigate to="/adminlogin" />;
  }

  // Authenticated as admin, render the component
  return <Component {...rest} />;
};

export default AdminProtectedRoute;
