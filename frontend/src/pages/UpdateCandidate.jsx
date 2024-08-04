// UpdateCandidate.jsx
import React, { useState } from 'react';
import axios from 'axios';

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

  return (
    <div>
      <h1>Update Candidate</h1>
      <input
        type="text"
        value={candidateId}
        onChange={handleIdChange}
        placeholder="Enter Candidate ID"
      />
      <button onClick={searchCandidate}>Search</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {candidateDetails && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Candidate Name:</label>
            <input
              type="text"
              name="candidate_name"
              value={updatedDetails.candidate_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Candidate Party:</label>
            <input
              type="text"
              name="candidate_party"
              value={updatedDetails.candidate_party}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Block Number:</label>
            <input
              type="text"
              name="block_number"
              value={updatedDetails.block_number}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Picture:</label>
            <input
              type="file"
              name="picture"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit">Update Candidate</button>
        </form>
      )}
    </div>
  );
};

export default UpdateCandidate;
