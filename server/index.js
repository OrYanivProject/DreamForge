const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const UsersModel = require('./models/users')

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/users")

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

app.post('/register', (req,res) => {
    UsersModel.create(req.body)
    .then(user => res.json("Success"))
    .catch(err => res.status(500).json(err))
})

app.listen(3001, () => {
    console.log("server is running")
})