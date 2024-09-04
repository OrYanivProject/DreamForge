import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Home from './home';
import Welcome from './Welcome';  // Import the Welcome component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Welcome />}></Route>  // Set Welcome as the root path
        <Route path='/register' element={<Signup />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/home' element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
