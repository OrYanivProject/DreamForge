// server/firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Ensure this path is correct

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "dreamforge-d837f.appspot.com" // Replace with your Firebase Storage bucket URL
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
