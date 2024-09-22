import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';
 
function Header({ isLoggedIn, setIsLoggedIn }) {
    const navigate = useNavigate();

 
    const handleLogout = () => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.post('http://localhost:3001/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                setIsLoggedIn(false);
                navigate('/login');
            })
            .catch(err => {
                console.error('Logout failed:', err);
                if (err.response && err.response.status === 403) {
                    alert('Session has expired, please log in again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    setIsLoggedIn(false);
                    navigate('/login');
                } else {
                    alert('Logout failed, please try again.');
                }
            });
        }
    };
    
    
 
    const handleDreamForgeClick = () => {
        if (isLoggedIn) {
            navigate('/home');
        } else {
            navigate('/');
        }
    };
 
    return (
        <div className="navbar">
            <div className='nav-li'>
                <a onClick={handleDreamForgeClick} className="nav-link" style={{ cursor: 'pointer' }}>
                    <img src="\src\images\Icon.png" alt="Logo" className="logo" />
                    DreamForge
                </a>
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
 
export default Header;