const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const UsersModel = require('./models/users')

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://oryanivdb:OyYl9792@dreamforge.6leyx.mongodb.net/users")

app.post('/login', (req,res) =>{
    const {email, password} = req.body;
    UsersModel.findOne({email: email})
    .then(user => {
        if(user) {
            if(user.password === password){
                res.json("Success")
            } else {
                res.json("The password is incorrect")
            }
        } else {
            res.json("No such username exists")
        }
    })
})

app.post('/register', (req, res) => {
    // Search for a user that matches either the email or the name.
    UsersModel.findOne({ $or: [{ email: req.body.email }, { name: req.body.name }] })
        .then(existingUser => {
            if (existingUser) {
                if (existingUser.email === req.body.email && existingUser.name === req.body.name) {
                    // Both username and email already exist
                    return res.status(409).json({ message: "Both username and email already exist" });
                } else if (existingUser.email === req.body.email) {
                    // Only email exists
                    return res.status(409).json({ message: "Email already exists" });
                } else {
                    // Only username exists
                    return res.status(409).json({ message: "Username already exists" });
                }
            }
            // If no existing user, create a new one
            UsersModel.create(req.body)
                .then(user => res.json({ message: "Success" }))
                .catch(err => res.status(500).json({ message: err.message }));
        })
        .catch(err => res.status(500).json({ message: err.message }));
});




app.listen(3001, () => {
    console.log("server is running")
})