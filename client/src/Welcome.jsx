import React from 'react';
import Header from './Header';
import { Link } from 'react-router-dom';
import './styles.css';  // Ensure this CSS path is correct
import logo from './assets/images/logo.webp'; // Adjust the path to your logo

const Welcome = () => {
  return (
    <div>
      <Header />
      <div className="welcome-page">
        <div className="content">
          {/* Display the logo higher */}
          <img src={logo} alt="DreamForge Logo" className="logo" />

          {/* Adjust the DreamForge title */}
          <h1 className="main-title">DreamForge</h1>
          <p className="p">Bring Your Vision To The Next Level</p>
          <p className="p">Create Your Project's Blueprint in Seconds, No Experience Needed</p>
          <Link to="/register" className="button">Get Started</Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
