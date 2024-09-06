import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';
import Header from './Header';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/register', {name, email, password })
            .then(result => {
                if (result.data === "Success") {
                    navigate('/login');
                }else {
                    console.log("Registration failed:", result.data);
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
        <div>
            <Header />
        <div className="container">
            <div className="form-container">
                <h2 className="title">Create Account</h2>
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
