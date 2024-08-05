import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      setMessage('');
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
    <div className="container mt-5">
      <h2 className="mb-4">Update Voter</h2>
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Voter Number"
            value={voterNumber}
            onChange={(e) => setVoterNumber(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {voterData && (
        <div className="card p-4">
          <h3 className="mb-4">Voter Details</h3>
          <div className="form-group mb-3">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={updatedDetails.name || voterData.name}
              onChange={(e) => setUpdatedDetails({ ...updatedDetails, name: e.target.value })}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="phone_number">Phone Number:</label>
            <input
              type="text"
              id="phone_number"
              className="form-control"
              value={updatedDetails.phone_number || voterData.phone_number}
              onChange={(e) => setUpdatedDetails({ ...updatedDetails, phone_number: e.target.value })}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={updatedDetails.email || voterData.email}
              onChange={(e) => setUpdatedDetails({ ...updatedDetails, email: e.target.value })}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="date_of_birth">Date of Birth:</label>
            <input
              type="date"
              id="date_of_birth"
              className="form-control"
              value={updatedDetails.date_of_birth || voterData.date_of_birth}
              onChange={(e) => setUpdatedDetails({ ...updatedDetails, date_of_birth: e.target.value })}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="gender">Gender:</label>
            <input
              type="text"
              id="gender"
              className="form-control"
              value={updatedDetails.gender || voterData.gender}
              onChange={(e) => setUpdatedDetails({ ...updatedDetails, gender: e.target.value })}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              className="form-control"
              value={updatedDetails.address || voterData.address}
              onChange={(e) => setUpdatedDetails({ ...updatedDetails, address: e.target.value })}
            />
          </div>
          <div className="mt-3">
            <button className="btn btn-success me-2" onClick={handleUpdate}>
              Update
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className="mt-4 alert alert-info" role="alert">
          {message}
        </div>
      )}
    </div>
  );
};

export default UpdateVoter;
