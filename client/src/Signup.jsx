import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';
import Header from './Header';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return re.test(String(email).toLowerCase());
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setNameError('');
        setEmailError('');
        setPasswordError('');
        setGeneralError('');

        // Validate Username
        if (!/^[a-zA-Z0-9]{4,}$/.test(name)) {
            setNameError('Username must be at least 4 characters long and contain only letters and numbers.');
            return;
        }

        // Validate Password
        if (!/^[a-zA-Z0-9]{6,}$/.test(password)) {
            setPasswordError('Password must be at least 6 characters long and contain only letters and numbers.');
            return;
        }

        // Validate Email
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        // Proceed with Axios POST request if validation passes
        axios.post('http://localhost:3001/register', {name, email, password })
            .then(result => {
                if (result.data.message === "Success") {
                    navigate('/login');
                } else {
                    setGeneralError(result.data.message);
                }
            })
            .catch(err => {
                if (err.response) {
                    const message = err.response.data.message;
                    setGeneralError(message);
                } else {
                    setGeneralError("An unexpected error occurred. Please try again.");
                }
            });
    };

    return (
        <div>
        <div>
        <div className="container">
            <div className="form-container">
                <h2 className="title">Create Account</h2>
                {generalError && <p className="error general-error">{generalError}</p>}
                {nameError && <p className="error name-error">{nameError}</p>}
                {emailError && <p className="error email-error">{emailError}</p>}
                {passwordError && <p className="error password-error">{passwordError}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Name"
                        className="input-field"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="email"
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
                    <button className="button">Register</button>
                </form>
                <p className="link"><Link to="/login">Already have an account? Log in here.</Link></p>
            </div>
        </div>
        </div>
        </div>
    );
}

export default Signup;
