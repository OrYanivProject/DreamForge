const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    pdfUrl: { type: String, required: true }, // URL to where the PDF is stored
    createdAt: { type: Date, default: Date.now }
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
