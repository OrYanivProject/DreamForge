import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token'); // Check if token exists
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token on logout
        setIsLoggedIn(false);
        axios.post('http://localhost:3001/logout') // Optional server-side handling
            .then(() => {
                navigate('/login');
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="navbar">
            <div className='nav-li'>
                <Link to="/about-us" className="nav-link">DreamForge</Link>
                <Link to="/our-work" className="nav-link">Our Work</Link>
            </div>
            <div className='nav-li'>
                {isLoggedIn ? (
                    <>
                        <Link to="/bookshelf" className="nav-link">My Projects</Link>
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

export default Header;
