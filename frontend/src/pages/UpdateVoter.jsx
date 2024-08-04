import React, { useState } from 'react';
import axios from 'axios';

const UpdateVoter = () => {
  const [voterNumber, setVoterNumber] = useState('');
  const [voterData, setVoterData] = useState(null);
  const [message, setMessage] = useState('');
  const [updatedDetails, setUpdatedDetails] = useState({});

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/api/admin/voter/${voterNumber}`, {
        withCredentials: true,
      });
      setVoterData(response.data.voter);
    } catch (error) {
      console.error('Error fetching voter details:', error.response ? error.response.data : error.message);
      setMessage(error.response ? error.response.data.message : 'Error fetching voter details');
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:3002/api/admin/voter/${voterNumber}`, updatedDetails, {
        withCredentials: true,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error updating voter details:', error.response ? error.response.data : error.message);
      setMessage(error.response ? error.response.data.message : 'Error updating voter details');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:3002/api/admin/voter/${voterNumber}`, {
        withCredentials: true,
      });
      setMessage(response.data.message);
      setVoterData(null); // Clear voter data on successful delete
    } catch (error) {
      console.error('Error deleting voter:', error.response ? error.response.data : error.message);
      setMessage(error.response ? error.response.data.message : 'Error deleting voter');
    }
  };

  return (
    <div>
      <h2>Update Voter</h2>
      <input
        type="text"
        placeholder="Enter Voter Number"
        value={voterNumber}
        onChange={(e) => setVoterNumber(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {voterData && (
        <div>
          <h3>Voter Details</h3>
          <p>Name: <input type="text" value={updatedDetails.name || voterData.name} onChange={(e) => setUpdatedDetails({ ...updatedDetails, name: e.target.value })} /></p>
          <p>Phone Number: <input type="text" value={updatedDetails.phone_number || voterData.phone_number} onChange={(e) => setUpdatedDetails({ ...updatedDetails, phone_number: e.target.value })} /></p>
          <p>Email: <input type="email" value={updatedDetails.email || voterData.email} onChange={(e) => setUpdatedDetails({ ...updatedDetails, email: e.target.value })} /></p>
          <p>Date of Birth: <input type="date" value={updatedDetails.date_of_birth || voterData.date_of_birth} onChange={(e) => setUpdatedDetails({ ...updatedDetails, date_of_birth: e.target.value })} /></p>
          <p>Gender: <input type="text" value={updatedDetails.gender || voterData.gender} onChange={(e) => setUpdatedDetails({ ...updatedDetails, gender: e.target.value })} /></p>
          <p>Address: <input type="text" value={updatedDetails.address || voterData.address} onChange={(e) => setUpdatedDetails({ ...updatedDetails, address: e.target.value })} /></p>
          
          <button onClick={handleUpdate}>Update</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateVoter;
