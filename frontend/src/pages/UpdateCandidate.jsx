import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateCandidate = () => {
  const [candidateId, setCandidateId] = useState('');
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({
    candidate_name: '',
    candidate_party: '',
    block_number: '',
    picture: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle candidate ID input change
  const handleIdChange = (e) => {
    setCandidateId(e.target.value);
  };

  // Search for candidate details by ID
  const searchCandidate = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/api/admin/getCandidate/${candidateId}`, {
        withCredentials: true
      });
      setCandidateDetails(response.data);
      setUpdatedDetails({
        candidate_name: response.data.candidate_name,
        candidate_party: response.data.candidate_party,
        block_number: response.data.block_number,
        picture: null // Keep picture as null initially
      });
      setError('');
    } catch (err) {
      setError('Candidate not found or error occurred.');
      setCandidateDetails(null);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  // Handle picture file input change
  const handleFileChange = (e) => {
    setUpdatedDetails((prevDetails) => ({
      ...prevDetails,
      picture: e.target.files[0]
    }));
  };

  // Submit updated details
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('candidate_name', updatedDetails.candidate_name);
    formData.append('candidate_party', updatedDetails.candidate_party);
    formData.append('block_number', updatedDetails.block_number);
    if (updatedDetails.picture) {
      formData.append('picture', updatedDetails.picture);
    }

    try {
      await axios.put(`http://localhost:3002/api/admin/updateCandidate/${candidateId}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess('Candidate updated successfully');
      setError('');
    } catch (err) {
      setError('Error updating candidate');
      setSuccess('');
    }
  };

  // Delete candidate
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3002/api/admin/deleteCandidate/${candidateId}`, {
        withCredentials: true
      });
      setSuccess('Candidate deleted successfully');
      setError('');
      setCandidateDetails(null); // Clear candidate details from the state
      setUpdatedDetails({
        candidate_name: '',
        candidate_party: '',
        block_number: '',
        picture: null
      });
    } catch (err) {
      setError('Error deleting candidate');
      setSuccess('');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Update Candidate</h1>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          value={candidateId}
          onChange={handleIdChange}
          placeholder="Enter Candidate ID"
        />
        <button
          className="btn btn-primary mt-2"
          onClick={searchCandidate}
        >
          Search
        </button>
      </div>

      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}

      {candidateDetails && (
        <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
          <div className="mb-3">
            <label htmlFor="candidate_name" className="form-label">Candidate Name:</label>
            <input
              type="text"
              id="candidate_name"
              name="candidate_name"
              className="form-control"
              value={updatedDetails.candidate_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="candidate_party" className="form-label">Candidate Party:</label>
            <input
              type="text"
              id="candidate_party"
              name="candidate_party"
              className="form-control"
              value={updatedDetails.candidate_party}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="block_number" className="form-label">Block Number:</label>
            <input
              type="text"
              id="block_number"
              name="block_number"
              className="form-control"
              value={updatedDetails.block_number}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="picture" className="form-label">Picture:</label>
            <input
              type="file"
              id="picture"
              name="picture"
              className="form-control"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">Update Candidate</button>
          <button
            type="button"
            onClick={handleDelete}
            className="btn btn-danger ms-3"
          >
            Delete Candidate
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateCandidate;
