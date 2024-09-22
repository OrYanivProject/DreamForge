const { initializeApp,  cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const serviceAccount = require('./serviceAccountKey.json'); 
const firebaseConfig = {
  credential: cert(serviceAccount),
  storageBucket: "dreamforge-d837f.appspot.com"
};


const app = initializeApp(firebaseConfig);


const storage = getStorage();
const bucket = getStorage().bucket('dreamforge-d837f.appspot.com');

module.exports = { storage, app, bucket };
