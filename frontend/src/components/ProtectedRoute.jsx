import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';


const ProtectedRoute = ({ component: Component, requiredRole, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null means loading

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/checkAuth', { withCredentials: true });
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        const userRole = token ? jwtDecode(token.split('=')[1]).role : null;

        if (response.status === 200) {
          if (requiredRole && userRole !== requiredRole) {
            setIsAuthenticated('role'); // Role does not match
          } else {
            setIsAuthenticated(true); // Authenticated
          }
        }
      } catch (error) {
        setIsAuthenticated(false); // Not authenticated
      }
    };

    checkAuth();
  }, [requiredRole]);

  if (isAuthenticated === null) {
    // Waiting for authentication check
    return <div>Loading...</div>;
  }

  if (isAuthenticated === false) {
    // Not authenticated
    return <Navigate to="/login" />;
  }

  if (isAuthenticated === 'role') {
    // Role does not match
    return <Navigate to="/access-denied" />;
  }

  // Authenticated and role matches (if requiredRole is specified), render the component
  return <Component {...rest} />;
};

export default ProtectedRoute;
