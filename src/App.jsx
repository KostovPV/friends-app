import React, { Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import Header from './components/Header/Header'; 
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';

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

// Higher-order component to protect admin routes
const ProtectedRoute = ({ user, role, redirectPath = "/", children }) => {
  if (!user || user.role !== role) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

function App() {
  const { user, authIsReady } = useAuthContext();

  if (!authIsReady) {
    return <div>Loading authentication...</div>;
  }

  return (
    <BrowserRouter>
      {authIsReady && (
        <Suspense fallback={<div>Loading activity tracking...</div>}>
          <TrackUserActivity />
        </Suspense>
      )}
      <div className="app-container">
        <ToastContainer />
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/book" element={<BookParty />} />
            
            {/* Protected Admin Routes */}
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute user={user} role="admin">
                  <EditImage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute user={user} role="admin">
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/statistics"
              element={
                <ProtectedRoute user={user} role="admin">
                  <Statistics />
                </ProtectedRoute>
              }
            />

            {/* Auth Routes */}
            <Route path="/register" element={!user ? <Signup /> : <Navigate to="/" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/profile" element={<Profile />} />

            {/* Fallback for undefined routes */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
