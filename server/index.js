require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const UsersModel = require('./models/users');
const Book = require('./models/Book');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); 
const axios = require('axios'); 
const { Document, Packer, Paragraph, HeadingLevel} = require('docx'); 
const { bucket} = require('./firebaseConfig'); 
const fs = require('fs'); 


const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: 'GET,POST,PUT,DELETE', 
    credentials: true 
  }));

mongoose.connect("mongodb+srv://oryanivdb:OyYl9792@dreamforge.6leyx.mongodb.net/users");

const JWT_SECRET = 'your_jwt_secret_key';
const OPENAI_API_KEY = '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'; 


// verify token
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        jwt.verify(bearerToken, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log('JWT Verification Error:', err);
                if (err.name === "TokenExpiredError") {
                    return res.status(403).json({ message: 'Session expired', code: 'SESSION_EXPIRED' });
                }
                return res.status(403).json({ message: 'Unauthorized access' });
            }
            req.user = decoded;
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
                user.isLoggedIn = true; 
                user.save(); 
                const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: '24h' });
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
                books: [],  // Init - must
                isLoggedIn: false 
            });

            newUser.save()
                .then(user => res.json({ message: "Success", userId: user._id }))
                .catch(err => res.status(500).json({ message: err.message }));
        })
        .catch(err => res.status(500).json({ message: err.message }));
});

app.post('/logout', verifyToken, (req, res) => {
    if (!req.user || !req.user.id) {
        console.log('User ID not found in JWT payload:', req.user);  
        return res.status(400).json({ message: 'No user ID found in token' });
    }

    UsersModel.findByIdAndUpdate(req.user.id, { $set: { isLoggedIn: false } }, { new: true })
        .then(() => {
            res.json({ message: "Logged out successfully" });
        })
        .catch(err => {
            console.error('Error logging out:', err);
            res.status(500).json({ message: 'Failed to log out' });
        });
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

        res.status(204).send();  // Send a success status 
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
            user: userId  
        });

        await newBook.save(); 

        await UsersModel.findByIdAndUpdate(userId, {
            $push: { books: newBook._id }
        });

        res.status(201).json({ message: 'Book added successfully', book: newBook });
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ message: error.toString() });
    }
});

app.post('/users/:userId/createBook', async (req, res) => {
    const { userId } = req.params;
    const { prompt } = req.body;

    console.log(`Received book creation request for user: ${userId}`);
    console.log(`Sending improvement request to OpenAI with prompt: ${prompt}`);

    try {
        const improvementPrompt = `Take this idea and improve it, give me a requirements document for it back. The idea: ${prompt}`;
        let response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: improvementPrompt }],
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const requirementsDocument = response.data.choices[0].message.content;
        console.log('Received requirements document from OpenAI :/n' + requirementsDocument);

        const getNamePrompt = `Take this Requirements Document: ${requirementsDocument} and create a sofhisticated project name. Return the name(NOTHING ELSE).`;
        response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: getNamePrompt }],
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        const projectName = response.data.choices[0].message.content;


        
        const book = new Document({
            creator: 'Your Name or App Name',
            title: 'Project Book',
            description: 'Generated based on user\'s idea.',
            sections: [],
        });
       
        const chapterList = ['Introduction', 'Background and Related Work', 'Expected Achievements', 'System Architecture',
                              'Engineering Process', 'Product Requirements and Work Stages','Testing Plan'];
        let chapterNumber = 0;

        for (const chapter of chapterList) {
            chapterNumber = chapterNumber+1;
            console.log(`Creating content for chapter: ${chapter}`);
           

            const chapterPrompt = `Create the whole content for a ${chapter} (chapter number: ${chapterNumber})
            in the project book using the requirements document:
            '${requirementsDocument}', the structure should be as follows:
            Begin each main chapter with a major number (e.g., 1, 2, 3) followed by the title, excluding the word 'Chapter'.
            Within each main chapter, use ascending sub-numbers formatted as 'x.y' for subtitles, where 'x' is the chapter number and 'y' is the consecutive subtitle number.
            For sub-subtitles, continue the numbering as 'x.y.z', ensuring all numbers are in ascending order and properly aligned under the correct section or subsection.
            Ensure each main chapter starts with the next consecutive whole number, even if there are multiple sub-sections in the previous chapter.
            The content should adhere to academic standards, with a formal tone and structured layout appropriate for an academic final project book.
            Please use this structured approach to improve clarity and consistency throughout the document.`;
            response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4o-mini',
                    messages: [{ role: 'user', content: chapterPrompt }],
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Global variables to maintain state across chapters and sections
            let chapterContent = response.data.choices[0].message.content;
            console.log(`Content for ${chapter}: ${chapterContent}`);

            // Splits and parses the document content appropriately
            const lines = chapterContent.split('\n');

            const paragraphs = [];

            lines.forEach(line => {
                line = line.trim();  // Trim whitespace for cleaner processing
                if (line.startsWith('# ')) {  // Correctly handles main titles, removes any markdown syntax
                    const formattedTitle = line.substring(2).replace(/\*\*/g, '');
                    paragraphs.push(new Paragraph({
                        text: formattedTitle,
                        heading: HeadingLevel.HEADING_1,
                        bold: true,
                        font: { size: 32 },  // Font size for main title (16pt)
                        color: "000000",  // Black color
                    }));
                } else if (line.startsWith('## ')) {  // Handles subtitles
                    const subtitle = line.substring(3).replace(/\*\*/g, '');
                    paragraphs.push(new Paragraph({
                        text: subtitle,
                        heading: HeadingLevel.HEADING_2,
                        bold: true,
                        font: { size: 28 },  // Font size for subtitle (14pt)
                        color: "000000",  // Black color
                    }));
                } else if (line.startsWith('### ')) {  // Handles sub-subtitles
                    const subSubtitle = line.substring(4).replace(/\*\*/g, '');
                    paragraphs.push(new Paragraph({
                        text: subSubtitle,
                        heading: HeadingLevel.HEADING_3,
                        bold: false,
                        font: { size: 28 },  // Font size for subsubtitle (14pt)
                        color: "000000",  // Black color
                    }));
                } else if (line.startsWith('#### ')) {  // Handles sub-subtitles
                    const subSubtitle = line.substring(5).replace(/\*\*/g, '');
                    paragraphs.push(new Paragraph({
                        text: subSubtitle,
                        heading: HeadingLevel.HEADING_4,
                        bold: false,
                        font: { size: 28 },  // Font size for subsubtitle (14pt)
                        color: "000000",  // Black color
                        
                    }));
                } else if (line.startsWith('##### ')) {  // Handles sub-subtitles
                    const subSubtitle = line.substring(6).replace(/\*\*/g, '');
                    paragraphs.push(new Paragraph({
                        text: subSubtitle,
                        heading: HeadingLevel.HEADING_4,
                        bold: false,
                        font: { size: 28 },  // Font size for subsubtitle (14pt)
                        color: "000000",  // Black color
                    }));
                }else if (line.startsWith('- **')) {  
                    let cleanLine = line.replace('- **', '');  //it adds ●	automaticly so dont need to add.
                    cleanLine = cleanLine.replace('**:', ':');  // Clean up bold near colon
                    cleanLine = cleanLine.replace(':**',':');
                    paragraphs.push(new Paragraph({
                        text: cleanLine,
                        bullet: { level: 0 },  // Add bullets to list items
                        font: { size: 24 },  // Font size for text (12pt)
                        color: "000000",  // Black color
                    }));
                } else {  // Regular text
                    paragraphs.push(new Paragraph({
                        text: line.replace(/\*\*/g, ''),
                        font: { size: 24 },  // Font size for text (12pt)
                        color: "000000",  // Black color
                    }));
                }
            });

            // Add formatted paragraphs to the document
            book.addSection({
                properties: {},
                children: paragraphs,
            });




        }

        // Generate the buffer
        const buffer = await Packer.toBuffer(book);
        console.log('Document buffer created successfully');
        
        const fileName = `uploads/project_book_${Date.now()}.docx`;
        const file = bucket.file(fileName);

        // Upload the buffer to Firebase Storage
        await file.save(buffer);
        // Make the file public
        await file.makePublic();

        const fileURL = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        console.log('File uploaded successfully:', fileURL);

        const newBook = new Book({
            title: projectName,
            description: "Generated based on user's idea.",
            pdfUrl: fileURL,
            user: userId
        });

        await newBook.save();
        await UsersModel.findByIdAndUpdate(userId, { $push: { books: newBook._id } });
        console.log('New book saved and added to user profile successfully');
        res.status(201).json({ message: 'Book added successfully', fileURL: fileURL });
    } catch (error) {
        console.error("Error during book creation: ", error);
        res.status(500).json({ message: "Error generating project book", error: error.message });
    }
});
  
app.post('/users/:userId/upload', async (req, res) => {
    const { bookId } = req.body.bookId; // Assuming bookId is passed in the request body
    const buffer = Buffer.from(req.body.fileBuffer); // Convert incoming buffer to proper format
    console.log('Received file buffer for upload');
 
    const fileName = `uploads/project_book_${Date.now()}.docx`;
    const file = bucket.file(fileName);
    try
    {  
    await file.save(buffer);
    await file.makePublic();
    const fileURL = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    await Book.findByIdAndUpdate(bookId, { pdfUrl: fileURL });
    res.status(200).json({ message: 'File uploaded and book updated successfully', fileURL });
 
    } catch (error) {
        console.error("Error during book update - could not save changes", error);
        res.status(500).json({ message: "Error generating project book", error: error.message });
    }
   
});



app.use('/uploads', express.static(__dirname));


app.listen(3001, () => {
    console.log("server is running on port 3001");
});
