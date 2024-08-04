import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom for navigation

function Home() {
  return (
    <div style={styles.container}>
      <h1>Welcome to the Voting System</h1>
      <div style={styles.buttonContainer}>
        <Link to="/login" style={styles.button}>Login  Voter</Link>
        <Link to="/adminlogin" style={styles.button}>Login  Admin</Link>
      </div>
    </div>
  );
}

// Inline styles for the component
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5'
  },
  buttonContainer: {
    marginTop: '20px'
  },
  button: {
    display: 'block',
    width: '200px',
    padding: '10px',
    margin: '10px',
    textAlign: 'center',
    textDecoration: 'none',
    color: 'white',
    backgroundColor: '#007bff',
    borderRadius: '5px',
    fontSize: '16px'
  }
};

export default Home;
