import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

function Header({ isLoggedIn, setIsLoggedIn }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        axios.post('http://localhost:3001/logout')
            .then(() => {
                navigate('/login');
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="navbar">
            <div className='nav-li'>
                <Link to="/" className="nav-link">DreamForge</Link>
                <Link to="/about" className="nav-link">About Us</Link>
            </div>
            <div className='nav-li'>
                {isLoggedIn ? (
                    <>
                        <Link to="/bookshelf" className="nav-link">Bookshelf</Link>
                        <button className="nav-link button" onClick={handleLogout}>Log Out</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Log In</Link>
                        <Link to="/register" className="nav-link">Sign Up</Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default Header; // Ensure this line is present
