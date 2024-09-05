const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },  // assuming 'name' is the username and should be unique
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const UsersModel = mongoose.model("users",UsersSchema)
module.exports = UsersModel