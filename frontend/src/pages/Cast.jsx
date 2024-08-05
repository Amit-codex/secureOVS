import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cast = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [hasVoted, setHasVoted] = useState(false); // Track if the user has voted
  const [error, setError] = useState(null); // Track any error messages
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch candidates from the backend
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('/api/candidates');
        if (response.status === 200) {
          setCandidates(response.data);
        } else {
          console.error('Error fetching candidates: Unexpected response status:', response.status);
          setError('Failed to fetch candidates. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching candidates:', error.response ? error.response.data : error.message);
        setError('Failed to fetch candidates. Please try again.');
      }
    };

    fetchCandidates();
  }, []);

  const handleVote = async (e) => {
    e.preventDefault();

    if (!selectedCandidate) {
      alert('Please select a candidate.');
      return;
    }

    try {
      const response = await axios.post('/api/vote', { candidateId: selectedCandidate });
      if (response.status === 200) {
        setHasVoted(true);
        setError(null); // Clear any previous error messages
      } else {
        console.error('Error casting vote: Unexpected response status:', response.status);
        setError('Failed to cast vote. Please try again.');
      }
    } catch (error) {
      console.error('Error casting vote:', error.response ? error.response.data : error.message);
      setError('Failed to cast vote. Please try again.'); // Set error message
    }
  };

  // Render candidate details manually
  const renderCandidates = () => {
    return (
      <>
        {candidates.length > 0 && (
          <div className="form-check">
            <input
              type="radio"
              id={candidates[0].candidate_id}
              name="candidate"
              value={candidates[0].candidate_id}
              className="form-check-input"
              onChange={(e) => setSelectedCandidate(e.target.value)}
            />
            <label htmlFor={candidates[0].candidate_id} className="form-check-label">
              <div className="d-flex align-items-center">
                <img
                  src={candidates[0].picture}
                  alt={candidates[0].candidate_name}
                  className="img-thumbnail me-3"
                  style={{ width: '100px', height: '100px' }}
                />
                <div>
                  <h5>{candidates[0].candidate_name}</h5>
                  <p><strong>Party:</strong> {candidates[0].candidate_party}</p>
                  <p><strong>Block Number:</strong> {candidates[0].block_number}</p>
                </div>
              </div>
            </label>
          </div>
        )}
        {candidates.length > 1 && (
          <div className="form-check">
            <input
              type="radio"
              id={candidates[1].candidate_id}
              name="candidate"
              value={candidates[1].candidate_id}
              className="form-check-input"
              onChange={(e) => setSelectedCandidate(e.target.value)}
            />
            <label htmlFor={candidates[1].candidate_id} className="form-check-label">
              <div className="d-flex align-items-center">
                <img
                  src={candidates[1].picture}
                  alt={candidates[1].candidate_name}
                  className="img-thumbnail me-3"
                  style={{ width: '100px', height: '100px' }}
                />
                <div>
                  <h5>{candidates[1].candidate_name}</h5>
                  <p><strong>Party:</strong> {candidates[1].candidate_party}</p>
                  <p><strong>Block Number:</strong> {candidates[1].block_number}</p>
                </div>
              </div>
            </label>
          </div>
        )}
        {candidates.length > 2 && (
          <div className="form-check">
            <input
              type="radio"
              id={candidates[2].candidate_id}
              name="candidate"
              value={candidates[2].candidate_id}
              className="form-check-input"
              onChange={(e) => setSelectedCandidate(e.target.value)}
            />
            <label htmlFor={candidates[2].candidate_id} className="form-check-label">
              <div className="d-flex align-items-center">
                <img
                  src={candidates[2].picture}
                  alt={candidates[2].candidate_name}
                  className="img-thumbnail me-3"
                  style={{ width: '100px', height: '100px' }}
                />
                <div>
                  <h5>{candidates[2].candidate_name}</h5>
                  <p><strong>Party:</strong> {candidates[2].candidate_party}</p>
                  <p><strong>Block Number:</strong> {candidates[2].block_number}</p>
                </div>
              </div>
            </label>
          </div>
        )}
        {/* Add more conditions if you have more candidates */}
      </>
    );
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Cast Your Vote</h2>
      {hasVoted ? (
        <div className="alert alert-success" role="alert">
          Your vote has been cast successfully!
        </div>
      ) : (
        <form onSubmit={handleVote}>
          <h4>Select a Candidate:</h4>
          <div className="mb-3">
            {renderCandidates()}
          </div>
          {error && <div className="alert alert-danger" role="alert">{error}</div>} {/* Display error message if any */}
          <button type="submit" className="btn btn-primary">
            Submit Vote
          </button>
        </form>
      )}
    </div>
  );
};

export default Cast;
