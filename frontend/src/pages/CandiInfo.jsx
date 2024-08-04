import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const CandiInfo = () => {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch candidate data when component mounts
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/candidates');
        setCandidates(response.data);
      } catch (err) {
        setError('Error fetching candidate details');
      }
    };

    fetchCandidates();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Candidate Information</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {candidates.length === 0 ? (
        <p>No candidates available</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Candidate Name</th>
              <th>Party</th>
              <th>Block Number</th>
              <th>Picture</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.candidate_id}>
                <td>{candidate.candidate_name}</td>
                <td>{candidate.candidate_party}</td>
                <td>{candidate.block_number}</td>
                <td>
                  {candidate.picture ? (
                    <img
                      src={`http://localhost:3002/uploads/${candidate.picture}`}
                      alt={candidate.candidate_name}
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  ) : (
                    <p>No picture available</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CandiInfo;
