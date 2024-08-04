import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post('http://localhost:3002/api/admin/logout', {}, { withCredentials: true });
        alert('Admin logged out successfully');
        navigate('/adminlogin');
      } catch (error) {
        console.error('Error logging out:', error);
        alert('Logout failed');
      }
    };

    logout();
  }, [navigate]);

  return null;
};

export default AdminLogout;
