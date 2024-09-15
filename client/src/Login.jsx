import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';
import Header from './Header';
import logo from './assets/images/logo.webp'; // Ensure the path is correct

function Login() {
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
            <Header />
            <div className="login-container">
                <div className="form-container">
                    <h2 className="title">Welcome to DreamForge</h2>
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
                <div className="logo-container">
                    <img src={logo} alt="DreamForge Logo" className="logo" />
                </div>
            </div>
        </div>
    );
}

export default Login;
