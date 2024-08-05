import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCastVote = () => {
    navigate('/cast'); // Redirect to the cast vote page
  };

  const handleCandidateDetails = () => {
    navigate('/candiinfo'); // Redirect to the candidate details page
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Dashboard</h2>
      <div className="row">
        <div className="col-md-6 mb-3">
          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={handleCastVote}
          >
            Cast Vote
          </button>
        </div>
        <div className="col-md-6 mb-3">
          <button
            className="btn btn-secondary btn-lg btn-block"
            onClick={handleCandidateDetails}
          >
            Candidate Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

