import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Logout from './pages/Logout';
import AdminRegister from './pages/AdminRegister';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogout from './pages/AdminLogout';
import AddVoter from './pages/AddVoter';
import UpdateVoter from './pages/UpdateVoter';
import AddCandidate from './pages/AddCandidate';
import UpdateCandidate from './pages/UpdateCandidate';
import CandiInfo from './pages/CandiInfo';
import Cast from './pages/Cast';
import Verify from './pages/Verify';
import VoteConfirmation from './pages/VoteConfirmation';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Default route */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Protected Route Example */}
        <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/adminregister" element={<AdminRegister />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/adminlogout" element={<AdminLogout />} />
        <Route path="/addvoter" element={<AddVoter />} />
        <Route path="/updatevoter" element={<UpdateVoter />} />
        <Route path="/addcandidate" element={<AddCandidate />} />
        <Route path="/updatecandidate" element={<UpdateCandidate />} />
        <Route path="/candiinfo" element={<CandiInfo />} />
        <Route path="/cast" element={<Cast />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/confirmvote" element={<VoteConfirmation />} />
      </Routes>
    </Router>
  );
}

export default App;
