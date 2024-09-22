import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Signup from './Signup';
import Login from './Login';
import Home from './home';
import Welcome from './Welcome';
import Bookshelf from './Bookshelf';
import UploadForm from './components/UploadForm';
import AboutUs from './AboutUs';
import CreateBookComponent from './components/CreateBookComponent';
import DocumentEditor from './components/DocumentEditor';
 
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
 
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);
 
    return (
        <BrowserRouter>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Routes>
                <Route path='/' element={<Welcome />} />
                <Route path='/register' element={<Signup />} />
                <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path='/home' element={<Home />} />
                <Route path='/bookshelf' element={<Bookshelf />} />
                <Route path='/upload' element={<UploadForm />} />
                <Route path='/about' element={<AboutUs />} />
                <Route path='/create-book' element={<CreateBookComponent />} /> 
                <Route path='/documentEditor' element={<DocumentEditor />} />
            </Routes>
        </BrowserRouter>
    );
}
 
export default App;