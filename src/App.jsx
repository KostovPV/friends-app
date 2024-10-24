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
import Profile from './pages/Profile/Profile';
// import Profile from './components/Profile/Profile';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Galery from './pages/Gallery/Gallery';
import EditImage from './pages/EditImage/EditImage';
import Statistics from './pages/Statistics/Statistics';
import TrackUserActivity from './components/TrackUserActivity/TrackUserActivity';


function App() {
  const { user, authIsReady } = useAuthContext(); // Get user and authIsReady from context

  return (
    <BrowserRouter>
    {authIsReady && <TrackUserActivity />}
      <div className='app-container'>
      <ToastContainer /> 
        <Header />
        {authIsReady && ( // Check if auth is ready before rendering routes
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Galery />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/book" element={<BookParty />} />
            <Route
              path='/edit/:id'
              element={!user ? (
                <Navigate to="/" /> // Redirect to home if user is not logged in
              ) : user.role !== 'admin' ? (
                <Navigate to="/" /> // Redirect if user is not admin
              ) : (
                <EditImage />
              )}
            />
            <Route
              path='/upload'
              element={!user ? (
                <Navigate to="/" /> // Redirect to home if user is not logged in
              ) : user.role !== 'admin' ? (
                <Navigate to="/" /> // Redirect if user is not admin
              ) : (
                <Upload />
              )}
            />
             <Route
              path='/upload'
              element={!user ? (
                <Navigate to="/" /> // Redirect to home if user is not logged in
              ) : user.role !== 'admin' ? (
                <Navigate to="/" /> // Redirect if user is not admin
              ) : (
                <Upload />
              )}
            />
             <Route
              path='/statistics'
              element={!user ? (
                <Navigate to="/" /> // Redirect to home if user is not logged in
              ) : user.role !== 'admin' ? (
                <Navigate to="/" /> // Redirect if user is not admin
              ) : (
                <Statistics />
              )}
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
            <Route path="/profile" element={<Profile />} />
          </Routes>
        )}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
