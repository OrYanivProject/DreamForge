const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    pdfUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' } // Reference to the User
});


const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
