import React from 'react';
import { Link } from 'react-router-dom';
import icon from './images/icon.png'; 
import './styles.css';  
 
const Welcome = () => {
  return (
    <div>
       <div className="landing-container">
            <img src={icon} alt="DreamForge Icon" className="icon" />
            <h1 className="title">DreamForge</h1>
            <h2 className="subtitle">Bring Your Vision To The Next Level</h2>
            <p className="description">Create Your Project's Blueprint in Seconds, No Experience Needed</p>
          <Link to="/register" className="button">Get Started</Link>
      </div>
    </div>
  );
};
 
export default Welcome;