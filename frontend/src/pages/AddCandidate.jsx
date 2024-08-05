import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddCandidate = () => {
  const [candidateId, setCandidateId] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [candidateParty, setCandidateParty] = useState('');
  const [blockNumber, setBlockNumber] = useState('');
  const [pictureFile, setPictureFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e) => {
    setPictureFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('candidate_id', candidateId);
    formData.append('candidate_name', candidateName);
    formData.append('candidate_party', candidateParty);
    formData.append('block_number', blockNumber);
    formData.append('picture', pictureFile);

    try {
      const response = await axios.post('http://localhost:3002/api/admin/addCandidate', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMessage('Candidate added successfully');
      setErrorMessage('');
      console.log('Candidate added:', response.data);
    } catch (error) {
      console.error('Error adding candidate:', error);
      setErrorMessage('Error adding candidate');
      setSuccessMessage('');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add Candidate</h2>
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
        <div className="mb-3">
          <label htmlFor="candidateId" className="form-label">Candidate ID:</label>
          <input
            type="text"
            id="candidateId"
            className="form-control"
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="candidateName" className="form-label">Candidate Name:</label>
          <input
            type="text"
            id="candidateName"
            className="form-control"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="candidateParty" className="form-label">Candidate Party:</label>
          <input
            type="text"
            id="candidateParty"
            className="form-control"
            value={candidateParty}
            onChange={(e) => setCandidateParty(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="blockNumber" className="form-label">Block Number:</label>
          <input
            type="text"
            id="blockNumber"
            className="form-control"
            value={blockNumber}
            onChange={(e) => setBlockNumber(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="picture" className="form-label">Picture:</label>
          <input
            type="file"
            id="picture"
            className="form-control"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Candidate</button>
        {successMessage && <p className="mt-3 text-success">{successMessage}</p>}
        {errorMessage && <p className="mt-3 text-danger">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default AddCandidate;
