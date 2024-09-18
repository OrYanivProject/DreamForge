// client/src/firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD8ARvGDlk0IrBq9-T0JxmekD7X1KHmtak",
  authDomain: "dreamforge-d837f.firebaseapp.com",
  projectId: "dreamforge-d837f",
  storageBucket: "dreamforge-d837f.appspot.com",
  messagingSenderId: "325178321475",
  appId: "1:325178321475:web:604d07aca292ccd9c542f6"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, app };
