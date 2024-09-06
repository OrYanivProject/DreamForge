const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require('jsonwebtoken'); // Import jwt for token-based authentication
const UsersModel = require('./models/users');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://oryanivdb:OyYl9792@dreamforge.6leyx.mongodb.net/users");

const JWT_SECRET = 'your_jwt_secret_key'; // Replace with a secure secret

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UsersModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, { expiresIn: '1h' });
                    res.json({ message: "Success", token });
                } else {
                    res.json("The password is incorrect");
                }
            } else {
                res.json("No such username exists");
            }
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

app.post('/register', (req, res) => {
    UsersModel.findOne({ $or: [{ email: req.body.email }, { name: req.body.name }] })
        .then(existingUser => {
            if (existingUser) {
                if (existingUser.email === req.body.email) {
                    return res.status(409).json({ message: "Email already exists" });
                } else {
                    return res.status(409).json({ message: "Username already exists" });
                }
            }
            UsersModel.create(req.body)
                .then(user => res.json({ message: "Success" }))
                .catch(err => res.status(500).json({ message: err.message }));
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

app.post('/logout', (req, res) => {
    // You can handle session removal or token invalidation logic here
    res.json({ message: "Logged out successfully" });
});

app.listen(3001, () => {
    console.log("server is running");
});
