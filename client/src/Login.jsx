import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/login', { username, password })
            .then(result => {
                if (result.data === "Success") {
                    navigate('/home');
                } else {
                    alert('Login failed!');
                }
            })
            .catch(err => {
                alert('Error logging in');
                console.log(err);
            });
    };

    return (
        <div className="login-container">
            <div className="form-container">
                <h2 className="title">Login to DreamForge</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        className="input-field"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
    );
}

export default Login;
