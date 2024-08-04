import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Cast = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch candidates from the backend
    axios.get('http://localhost:3002/api/candidates')
      .then(response => {
        console.log('Candidates fetched:', response.data); // Log the fetched candidates
        setCandidates(response.data);
      })
      .catch(error => console.error('Error fetching candidates:', error));
  }, []);

  const handleVote = async () => {
    if (!selectedCandidate) {
      alert('Please select a candidate');
      return;
    }

    try {
      // Post the vote without voter number
      const response = await axios.post('http://localhost:3002/api/vote', { candidate_id: selectedCandidate });
      alert(response.data.message);
      navigate('/confirmvote'); // Redirect to vote confirmation page
    } catch (error) {
      console.error('Error casting vote:', error);
      alert('Error casting vote. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Cast Your Vote</h1>
      <form>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Select</th>
              <th>Picture</th>
              <th>Candidate Name</th>
              <th>Party</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(candidate => (
              <tr key={candidate.candidate_id}>
                <td>
                  <input
                    type="radio"
                    name="candidate"
                    value={candidate.candidate_id}
                    onChange={(e) => setSelectedCandidate(e.target.value)}
                    checked={selectedCandidate === candidate.candidate_id}
                  />
                </td>
                <td>
                  <img
                    src={`http://localhost:3002/uploads/${candidate.picture}`} // Adjust the path if needed
                    alt={candidate.candidate_name}
                    style={{ width: '50px', height: '50px' }} // Set the size of the image
                  />
                </td>
                <td>{candidate.candidate_name}</td>
                <td>{candidate.candidate_party}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="btn btn-primary" onClick={handleVote}>Vote</button>
      </form>
    </div>
  );
};

export default Cast;
