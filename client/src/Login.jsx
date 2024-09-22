import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

function Login({ setIsLoggedIn }) { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/login', { email, password })
            .then(result => {
                if (result.data.message === "Success") {
                    localStorage.setItem('token', result.data.token);
                    localStorage.setItem('userId', result.data.userId);
                    setIsLoggedIn(true); 
                    navigate('/home');
                } else {
                    alert(result.data.message); 
                }
            })
            .catch(err => {
                alert('Error logging in');
                console.log(err);
            });
    };

    return (
        <div>
            <div className="login-container">
                <div className="form-container">
                    <h2 className="loginTitle">Login to DreamForge</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="button">Login</button>
                    </form>
                    <Link to="/register" className="link">Don't have an account yet? Create one here.</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
