import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';
import Header from './Header';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/login', { email, password })
            .then(result => {
                if (result.data.message === "Success") {
                    // Store the token in localStorage
                    localStorage.setItem('token', result.data.token);
                    // Redirect the user after successful login
                    navigate('/home');
                } else {
                    alert(result.data); // Show the error message (like "Incorrect password")
                }
            })
            .catch(err => {
                alert('Error logging in');
                console.log(err);
            });
    };

    return (
        <div>
        <Header />
        <div className="login-container">
            <div className="form-container">
                <h2 className="title">Login to DreamForge</h2>
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
                <Link to="/forgot-password" className="forgot-link">Forgot Username or Password?</Link>
                <Link to="/register" className="link">Create a new account.</Link>
            </div>
        </div>
        </div>
    );
}

export default Login;
