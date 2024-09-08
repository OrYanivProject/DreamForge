const mongoose = require('mongoose');
const Book = require('./Book'); // Assuming the Book model is in the same directory

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] // Reference to Book documents
});

const UsersModel = mongoose.model("users", userSchema);
module.exports = UsersModel;
