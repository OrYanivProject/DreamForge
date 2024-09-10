const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] // References to Book documents
});

const UsersModel = mongoose.model("users", userSchema);
module.exports = UsersModel;
