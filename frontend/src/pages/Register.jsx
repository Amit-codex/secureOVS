import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    voterNumber: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  // Password validation function
  const isPasswordValid = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  // Phone number validation function
  const isPhoneNumberValid = (phoneNumber) => {
    return phoneNumber.length === 10 && !isNaN(phoneNumber);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!isPasswordValid(formData.password)) {
      toast.error('Password must be at least 8 characters long, include one capital letter, one small letter, one number, and one special character');
      return;
    }

    if (!isPhoneNumberValid(formData.phoneNumber)) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3002/api/register', formData);
      toast.success(response.data.message); // Show success message from the server
      // Reset form fields
      setFormData({
        name: '',
        voterNumber: '',
        phoneNumber: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        password: '',
        confirmPassword: '',
      });
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message); // Show error message from the server
      } else {
        toast.error('Registration failed');
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title mb-4">Register</h3>
              <form onSubmit={handleSubmit}>
                {/* Form fields here */}
                <div className="mb-3">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="voterNumber"
                    className="form-control"
                    value={formData.voterNumber}
                    onChange={handleChange}
                    placeholder="Voter Number"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="phoneNumber"
                    className="form-control"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="form-control"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Gender</label>
                  <div>
                    <div className="form-check">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        className="form-check-input"
                        checked={formData.gender === 'Male'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Male</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        className="form-check-input"
                        checked={formData.gender === 'Female'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Female</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        name="gender"
                        value="Other"
                        className="form-check-input"
                        checked={formData.gender === 'Other'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Other</label>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address"
                    required
                  />
                </div>
                <div className="mb-3 position-relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                  <span
                    className="position-absolute top-50 end-0 translate-middle-y pe-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <div className="mb-3 position-relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className="form-control"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    required
                  />
                  <span
                    className="position-absolute top-50 end-0 translate-middle-y pe-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
                <p>If you already have an account, <a href="/login">Login Here</a></p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer /> {/* ToastContainer for showing toast notifications */}
    </div>
  );
};

export default Register;