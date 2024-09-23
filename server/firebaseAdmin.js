const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); 


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "dreamforge-d837f.appspot.com" 
});

const storage = admin.storage().bucket();

module.exports = { admin,storage };
