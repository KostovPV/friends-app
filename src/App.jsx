// src/App.jsx
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext'; // Import useAuthContext
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { Home } from './pages/Home/Home';
import Terms from './pages/Terms/Terms';
import Contacts from './pages/Contacts/Contacts';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Logout from './components/Logout/Logout';
import Upload from './pages/Upload/Upload';
import BookParty from './pages/BookParty/BookParty';


function App() {
  const { user, authIsReady } = useAuthContext(); // Get user and authIsReady from context

  return (
    <BrowserRouter>
      <div className='app-container'>
        <Header />
        {authIsReady && ( // Check if auth is ready before rendering routes
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/book" element={<BookParty />} />
            <Route
              path='/upload'
              element={!user ?  <Navigate to="/" />: <Upload />}

            />
            <Route
              path="/register"
              element={!user ? <Signup /> : <Navigate to="/" />} // Redirect if user is logged in
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />} // Redirect if user is logged in
            />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        )}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
