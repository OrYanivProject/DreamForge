require('dotenv').config();
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



//####  User login/out and registretion ####
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UsersModel.findOne({ email: email })
        .then(user => {
            if (user && user.password === password) {  // Assume passwords are correctly managed
                const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: '1h' });
                res.json({ message: "Success", token, userId: user._id.toString() }); // Ensure userId is sent
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



// API to get all books for a user
app.get('/users/:userId/books', verifyToken, async (req, res) => {
    console.log('Decoded user ID:', req.user.id);
    console.log('URL user ID:', req.params.userId);

    if (String(req.user.id) !== String(req.params.userId)) {
        return res.status(403).json({ message: "Unauthorized access" });
    }
    try {
        // Populate books from the 'Book' model
        const user = await UsersModel.findById(req.params.userId).populate('books');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log('User found:', user);
        console.log('Books:', user.books);  // This should now print the user's books

        res.status(200).json(user.books); // Send back the user's books array
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: error.message });
    }
});




// API to delete a book from a user's bookshelf
app.delete('/users/:userId/books/:bookId', async (req, res) => {
    try {
        // Directly delete the book and check if deletion was successful
        const deletedBook = await Book.findOneAndDelete({ _id: req.params.bookId });
        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Update the user's document to pull the book from their books array
        await UsersModel.findByIdAndUpdate(req.params.userId, { $pull: { books: req.params.bookId } });

        res.status(204).send();  // Send a success status without content
    } catch (error) {
        console.error('Error removing book:', error);
        res.status(500).json({ message: 'Internal Server Error: ' + error.message });
    }
});






app.post('/users/:userId/books', async (req, res) => {
    const { userId } = req.params; // Assuming you're receiving the user's ID in the URL
    const { title, description, pdfUrl } = req.body; // Details about the book

    try {
        const newBook = new Book({
            title,
            description,
            pdfUrl,
            user: userId  // Link the book to the user who uploaded it
        });

        await newBook.save(); // Save the new book

        // Link the new book to the user's list of books
        await UsersModel.findByIdAndUpdate(userId, {
            $push: { books: newBook._id }
        });

        res.status(201).json({ message: 'Book added successfully', book: newBook });
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ message: error.toString() });
    }
});



// ######################################
//    Dropbox and Uploading section
// ######################################

//session middleware to store token temporarily
const session = require('express-session');

app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: true,
}));

//creating the OAuth2 authorization route
const axios = require('axios');
const client_id = 'ppo8obtemw37z2m';
const client_secret = '7dskb64sprhz7fe';
const redirect_uri = 'http://localhost:3001/auth/callback'; 

app.get('/auth/dropbox', (req, res) => {
    const dropboxAuthURL = `https://www.dropbox.com/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&token_access_type=offline`;
    res.redirect(dropboxAuthURL);
});


//Handle OAuth2 callback in the /auth/callback route
app.get('/auth/callback', async (req, res) => {
    const authorizationCode = req.query.code;

    if (!authorizationCode) {
        return res.status(400).send('Authorization code not found');
    }

    try {
        const response = await axios.post('https://api.dropboxapi.com/oauth2/token', new URLSearchParams({
            code: authorizationCode,
            grant_type: 'authorization_code',
            client_id: process.env.DROPBOX_CLIENT_ID,  // Use environment variables
            client_secret: process.env.DROPBOX_CLIENT_SECRET,  // Use environment variables
            redirect_uri: 'http://localhost:3001/auth/callback'
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const { access_token, refresh_token } = response.data;

        console.log('Access Token:', access_token);
        console.log('Refresh Token:', refresh_token);

        res.send('Successfully authenticated! Check the server console for tokens.');
    } catch (error) {
        console.error('Error exchanging code for tokens:', error.response?.data || error.message);
        res.status(500).send('Error during authentication');
    }
});




const setupDropboxClient = require('./dropboxClient');
const refreshAccessToken = require('./refreshDropboxToken'); // Import refresh token function

app.post('/users/:userId/upload', upload.single('file'), async (req, res) => {
    const { userId } = req.params;
    const { title, description } = req.body;

    try {
        // Check if the access token exists in the environment and refresh if necessary
        let accessToken = process.env.DROPBOX_ACCESS_TOKEN;

        // If access token doesn't exist or is about to expire, refresh it
        if (!accessToken) {
            accessToken = await refreshAccessToken();
        }

        // Initialize Dropbox client with the (potentially refreshed) access token
        const dbx = await setupDropboxClient(accessToken);

        const { file } = req;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        // Read file contents
        const fileContents = require('fs').readFileSync(file.path);

        // Upload file to Dropbox
        const uploadResponse = await dbx.filesUpload({
            path: '/' + file.originalname,
            contents: fileContents,
            mode: 'add',
            autorename: true,
            mute: false
        });

        // Clean up the uploaded file
        require('fs').unlinkSync(file.path);

        // Get the path of the uploaded file
        const dropboxFilePath = uploadResponse.result.path_lower;

        // Try creating a shared link for the file
        let sharedLinkResponse;
        try {
            sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({
                path: dropboxFilePath
            });
        } catch (error) {
            if (error?.error?.error_summary.includes('shared_link_already_exists')) {
                // If the link already exists, reuse it
                sharedLinkResponse = await dbx.sharingListSharedLinks({
                    path: dropboxFilePath
                });
            } else {
                throw error;  // Re-throw the error if it's a different issue
            }
        }

        // Check if the links array exists and has at least one item
        const links = sharedLinkResponse?.result?.links;
        if (Array.isArray(links) && links.length > 0) {
            const pdfUrl = links[0].url.replace('?dl=0', '?dl=1');

            // Create and save the book in MongoDB
            const newBook = new Book({
                title,
                description,
                pdfUrl,
                user: userId
            });

            await newBook.save();  // Save the new book to MongoDB

            // Link the new book to the user's list of books
            await UsersModel.findByIdAndUpdate(userId, {
                $push: { books: newBook._id }
            });

            res.status(201).json({ message: 'Book uploaded and added to your bookshelf', book: newBook });
        } else {
            throw new Error("No valid links found to generate the file URL.");
        }
    } catch (error) {
        console.error('Failed to upload file:', error);
        res.status(500).json({ message: 'Failed to upload file. ' + error.message });
    }
});











// POST endpoint to upload a file and create a book entry
// app.post('/users/:userId/upload', upload.single('file'), async (req, res) => {
//     const { file } = req;
//     if (!file) {
//         return res.status(400).send('No file uploaded.');
//     }

//     try {
//         const fileContents = require('fs').readFileSync(file.path);
//         const response = await dbx.filesUpload({
//             path: '/' + file.originalname,
//             contents: fileContents,
//             mode: 'add',
//             autorename: true,
//             mute: false
//         });

//         require('fs').unlinkSync(file.path);  // Clean up the uploaded file

//         const pdfUrl = `https://www.dropbox.com/s/${response.result.path_lower}?dl=1`;  // Ensure this is the correct way to form the URL

//         // Add additional logic here to save the book details to your database if necessary
//         res.send('File uploaded successfully!');
//     } catch (error) {
//         console.error('Failed to upload file:', error);
//         res.status(500).send('Failed to upload file.');
//     }
// });



  

app.listen(3001, () => {
    console.log("server is running on port 3001");
});
