import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Signup from './Signup';
import Login from './Login';
import Home from './home';
import Welcome from './Welcome';  
import Bookshelf from './Bookshelf'; 
import UploadForm from './components/UploadForm';
import AboutUs from './AboutUs';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage logged-in state here

  return (
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> {/* Pass state and updater to Header */}
      <Routes>
        <Route path='/' element={<Welcome />}></Route>
        <Route path='/register' element={<Signup />}></Route>
        <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} />}></Route> {/* Pass setIsLoggedIn to Login */}
        <Route path='/home' element={<Home />}></Route>
        <Route path='/bookshelf' element={<Bookshelf />} />
        <Route path='/upload' element={<UploadForm />} />
        <Route path='/about' element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
