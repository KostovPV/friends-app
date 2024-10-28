import React, { Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import Header from './components/Header/Header'; // Home page components
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';

// Lazy load all other components
const Terms = lazy(() => import('./pages/Terms/Terms'));
const Contacts = lazy(() => import('./pages/Contacts/Contacts'));
const Login = lazy(() => import('./pages/Login/Login'));
const Signup = lazy(() => import('./pages/Signup/Signup'));
const Logout = lazy(() => import('./components/Logout/Logout'));
const Upload = lazy(() => import('./pages/Upload/Upload'));
const BookParty = lazy(() => import('./pages/BookParty/BookParty'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Gallery = lazy(() => import('./pages/Gallery/Gallery'));
const EditImage = lazy(() => import('./pages/EditImage/EditImage'));
const Statistics = lazy(() => import('./pages/Statistics/Statistics'));
const TrackUserActivity = lazy(() => import('./components/TrackUserActivity/TrackUserActivity'));
const PageNotFound = lazy(() => import('./components/404/404'));
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { user, authIsReady } = useAuthContext(); // Get user and authIsReady from context

  return (
    <BrowserRouter>
      {authIsReady && (
        <Suspense fallback={<div>Loading activity tracking...</div>}>
          <TrackUserActivity />
        </Suspense>
      )}
      <div className='app-container'>
        <ToastContainer />
        
        {/* Render Header and Footer immediately for Home page */}
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/book" element={<BookParty />} />
            <Route
              path="/edit/:id"
              element={
                user && user.role === 'admin' ? (
                  <EditImage />
                ) : (
                  <Navigate to="/" /> // Redirect if user is not logged in or not admin
                )
              }
            />
            <Route
              path="/upload"
              element={
                user && user.role === 'admin' ? (
                  <Upload />
                ) : (
                  <Navigate to="/" /> // Redirect if user is not logged in or not admin
                )
              }
            />
            <Route
              path="/statistics"
              element={
                user && user.role === 'admin' ? (
                  <Statistics />
                ) : (
                  <Navigate to="/" /> // Redirect if user is not logged in or not admin
                )
              }
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
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
