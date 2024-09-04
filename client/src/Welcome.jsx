import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';  // Ensure this CSS path is correct

const Welcome = () => {
  return (
    <div className="welcome-page">
      <div className="navbar">
        <div>
          <Link to="/about-us" className="nav-link">About Us</Link>
          <Link to="/faqs" className="nav-link">FAQs</Link>
          <Link to="/our-work" className="nav-link">Our Work</Link>
        </div>
        <div>
          <Link to="/login" className="nav-link">Log In</Link>
          <Link to="/signup" className="nav-link">Sign Up</Link>
        </div>
      </div>
      <div className="content">
        <h1 className="title">DreamForge</h1>
        <p className="p">Bring Your Vision To The Next Level</p>
        <p className="p">Create Your Project's Blueprint in Seconds, No Experience Needed</p>
        <Link to="/register" className="button">Get Started</Link>
      </div>
    </div>
  );
};

export default Welcome;
