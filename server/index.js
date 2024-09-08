const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const UsersModel = require('./models/users');
const Book = require('./models/Book');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const dbx = require('./dropboxClient');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://oryanivdb:OyYl9792@dreamforge.6leyx.mongodb.net/users");

const JWT_SECRET = 'your_jwt_secret_key'; // Replace with a secure secret

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];  // Extract the token from Bearer <token>
        jwt.verify(bearerToken, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token" }); // Token is not valid
            } else {
                req.user = decoded;  // Add decoded user information to request object
                next();
            }
        });
    } else {
        res.status(401).json({ message: "Auth token is not supplied" }); // No token provided
    }
};


app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UsersModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    // Generate a token
                    const token = jwt.sign({ email: user.email, id: user._id.toString() }, JWT_SECRET, { expiresIn: '1h' });
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

            // Create user with an empty books array if no existing user was found
            const newUser = new UsersModel({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                books: []  // Initialize the books array when creating a new user
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

/// Protected route: Add a book to a user's bookshelf
app.post('/users/:userId/books', async (req, res) => {
    if (req.user.id !== req.params.userId) {
        return res.status(403).json({ message: "Unauthorized access" });
    }
    try {
        const { title, description, pdfUrl } = req.body;
        const book = new Book({ title, description, pdfUrl });
        await book.save();

        const user = await UsersModel.findById(req.params.userId);
        user.books.push(book._id);  // Ensure you're pushing book ID not book object
        await user.save();

        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API to get all books for a user
app.get('/users/:userId/books', verifyToken, async (req, res) => {
    // Ensuring the user ID from the token matches the user ID in the path
    if (req.user.id !== req.params.userId) {
        return res.status(403).json({ message: "Unauthorized access" });
    }
    try {
        const user = await UsersModel.findById(req.params.userId).populate('books');
        res.status(200).json(user.books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// API to delete a book from a user's bookshelf
app.delete('/users/:userId/books/:bookId', async (req, res) => {
    try {
        await Book.findByIdAndRemove(req.params.bookId);
        await UsersModel.findByIdAndUpdate(req.params.userId, { $pull: { books: req.params.bookId } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
      const { path: tempPath, originalname } = req.file;
      const fileContents = require('fs').readFileSync(tempPath);
  
      const response = await dbx.filesUpload({
        path: '/' + originalname,
        contents: fileContents
      });
  
      // Optionally, remove the file after upload
      require('fs').unlinkSync(tempPath);
  
      res.send('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file: ', error);
      res.status(500).send('Failed to upload file.');
    }
  });
  

app.listen(3001, () => {
    console.log("server is running on port 3001");
});
