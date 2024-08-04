import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const Login = () => {
  const [formData, setFormData] = useState({
    voterNumber: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:3002/api/login', formData, { withCredentials: true });
      console.log('Login successful:', response.data);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.status === 401 && error.response.data.message === 'Invalid credentials: Wrong password') {
        toast.error('Wrong password');
      } else {
        console.error('Error logging in:', error.response ? error.response.data : error.message);
        toast.error('Login failed');
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title mb-4">Login</h3>
              <form onSubmit={handleSubmit}>
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
                <button type="submit" className="btn btn-primary">Login</button>
                <p>If you don't have an account, <a href="/register">Register Here</a></p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer /> {/* ToastContainer for showing toast notifications */}
    </div>
  );
};

export default Login;
