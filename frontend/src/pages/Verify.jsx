import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Verify = () => {
  const [voterNumber, setVoterNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a request to the server to verify the voter number
      const response = await axios.post('http://localhost:3002/api/verify-voter', { voterNumber });
      if (response.data.verified) {
        navigate('/cast'); // Redirect to the cast page if verified
      } else {
        setError('Voter number not found. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while verifying. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Voter Verification</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="voterNumber" className="form-label">Voter Number</label>
          <input
            type="text"
            id="voterNumber"
            className="form-control"
            value={voterNumber}
            onChange={(e) => setVoterNumber(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary">Verify</button>
      </form>
    </div>
  );
};

export default Verify;
