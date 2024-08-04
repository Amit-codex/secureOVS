import React, { useState } from 'react';
import axios from 'axios';

const AddCandidate = () => {
  const [candidateId, setCandidateId] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [candidateParty, setCandidateParty] = useState('');
  const [blockNumber, setBlockNumber] = useState('');
  const [pictureFile, setPictureFile] = useState(null);  // State to hold the selected file
  const [successMessage, setSuccessMessage] = useState('');  // State to hold success message
  const [errorMessage, setErrorMessage] = useState('');  // State to hold error message

  const handleFileChange = (e) => {
    setPictureFile(e.target.files[0]);  // Update state with the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('candidate_id', candidateId);
    formData.append('candidate_name', candidateName);
    formData.append('candidate_party', candidateParty);
    formData.append('block_number', blockNumber);
    formData.append('picture', pictureFile);  // Append the file to FormData

    try {
      const response = await axios.post('http://localhost:3002/api/admin/addCandidate', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMessage('Candidate added successfully');
      setErrorMessage('');  // Clear error message if successful
      console.log('Candidate added:', response.data);
    } catch (error) {
      console.error('Error adding candidate:', error);
      setErrorMessage('Error adding candidate');  // Set error message on failure
      setSuccessMessage('');  // Clear success message if there's an error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Candidate ID:</label>
        <input
          type="text"
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Candidate Name:</label>
        <input
          type="text"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Candidate Party:</label>
        <input
          type="text"
          value={candidateParty}
          onChange={(e) => setCandidateParty(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Block Number:</label>
        <input
          type="text"
          value={blockNumber}
          onChange={(e) => setBlockNumber(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Picture:</label>
        <input
          type="file"
          onChange={handleFileChange}  // Handle file selection
          required
        />
      </div>
      <button type="submit">Add Candidate</button>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}  {/* Display success message */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}  {/* Display error message */}
    </form>
  );
};

export default AddCandidate;
