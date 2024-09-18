require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const UsersModel = require('./models/users');
const Book = require('./models/Book');
const multer = require('multer');
const { bucket } = require('./firebaseAdmin'); // Import the bucket object
const upload = multer({ storage: multer.memoryStorage() }); 
const { bucket } = require('./firebaseAdmin'); // Import the bucket object
const upload = multer({ storage: multer.memoryStorage() }); 

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://oryanivdb:OyYl9792@dreamforge.6leyx.mongodb.net/users");

const JWT_SECRET = 'your_jwt_secret_key'; // Replace with a secure secret

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        jwt.verify(bearerToken, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Unauthorized access' });
            }
            req.user = decoded;  // The token is decoded successfully here
            next();
        });
    } else {
        return res.status(401).json({ message: 'Authorization header not found' });
    }
};

//####  User login/out and registration ####
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UsersModel.findOne({ email: email })
        .then(user => {
            if (user && user.password === password) { 
                user.isLoggedIn = true; // Update login status
                user.save(); // Save the updated user
                const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: '1h' });
                res.json({ message: "Success", token, userId: user._id.toString() });
            } else {
                res.status(401).json({ message: "No such username exists or password is incorrect" });
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

            const newUser = new UsersModel({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                books: [],  // Initialize the books array
                isLoggedIn: false // Add this line
            });

            newUser.save()
                .then(user => res.json({ message: "Success", userId: user._id }))
                .catch(err => res.status(500).json({ message: err.message }));
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

app.post('/logout', (req, res) => {
    res.json({ message: "Logged out successfully" });
});

// API to get all books for a user
app.get('/users/:userId/books', verifyToken, async (req, res) => {
    if (String(req.user.id) !== String(req.params.userId)) {
        return res.status(403).json({ message: "Unauthorized access" });
    }
    try {
        const user = await UsersModel.findById(req.params.userId).populate('books');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.books); // Send back the user's books array
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: error.message });
    }
});

// API to delete a book from a user's bookshelf
app.delete('/users/:userId/books/:bookId', async (req, res) => {
    try {
        const deletedBook = await Book.findOneAndDelete({ _id: req.params.bookId });
        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        await UsersModel.findByIdAndUpdate(req.params.userId, { $pull: { books: req.params.bookId } });

        res.status(204).send();  // Send a success status without content
    } catch (error) {
        console.error('Error removing book:', error);
        res.status(500).json({ message: 'Internal Server Error: ' + error.message });
    }
});

app.post('/users/:userId/books', async (req, res) => {
    const { userId } = req.params;
    const { title, description, pdfUrl } = req.body;

    try {
        const newBook = new Book({
            title,
            description,
            pdfUrl,
            user: userId  // Link the book to the user who uploaded it
        });

        await newBook.save(); // Save the new book

        await UsersModel.findByIdAndUpdate(userId, {
            $push: { books: newBook._id }
        });

        res.status(201).json({ message: 'Book added successfully', book: newBook });
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ message: error.toString() });
    }
});

app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: "No file uploaded." });
    }

    try {
        const fileName = Date.now() + '-' + file.originalname;
        const fileUpload = bucket.file(fileName);

        await fileUpload.save(file.buffer, {
            contentType: file.mimetype,
            resumable: false
        });

        const fileURL = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        res.status(201).json({ message: 'File uploaded successfully', fileURL });
    } catch (error) {
        console.error('Failed to upload file:', error);
        res.status(500).json({ message: 'Failed to upload file. ' + error.message });
    }
});


app.listen(3001, () => {
    console.log("server is running on port 3001");
});
