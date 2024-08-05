import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Admin Dashboard</h1>
      <div className="row">
        {/* Section 1: Voter Management */}
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Voter Management</h5>
              <ul className="list-group">
                <li className="list-group-item">
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => navigate('/addvoter')}
                  >
                    Add Voter
                  </button>
                </li>
                <li className="list-group-item">
                  <button
                    className="btn btn-secondary btn-block"
                    onClick={() => navigate('/updatevoter')}
                  >
                    Update Voter
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 2: Candidate Management */}
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Candidate Management</h5>
              <ul className="list-group">
                <li className="list-group-item">
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => navigate('/addcandidate')}
                  >
                    Add Candidate
                  </button>
                </li>
                <li className="list-group-item">
                  <button
                    className="btn btn-secondary btn-block"
                    onClick={() => navigate('/updatecandidate')}
                  >
                    Update Candidate
                  </button>
                </li>
                <li className="list-group-item">
                  <button
                    className="btn btn-info btn-block"
                    onClick={() => navigate('/candiinfo')}
                  >
                    Candidate Details
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Vote Results */}
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Vote Results</h5>
              <button
                className="btn btn-success btn-block"
                onClick={() => navigate('/voteresults')}
              >
                View Vote Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
