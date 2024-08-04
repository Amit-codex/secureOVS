import React, { useState } from 'react';
import axios from 'axios';

const AddVoter = () => {
  const [voterNumber, setVoterNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'voterNumber') setVoterNumber(value);
    if (name === 'phoneNumber') setPhoneNumber(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3002/api/admin/addVoter', 
        { voterNumber, phoneNumber }, 
        { withCredentials: true }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error adding voter:', error);
      setMessage(error.response ? error.response.data.message : 'Error adding voter');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title mb-4">Add Voter</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="voterNumber"
                    className="form-control"
                    value={voterNumber}
                    onChange={handleChange}
                    placeholder="Enter Voter Number"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="phoneNumber"
                    className="form-control"
                    value={phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter Phone Number"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Add Voter</button>
              </form>
              {message && <div className="mt-3 alert alert-info">{message}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVoter;
