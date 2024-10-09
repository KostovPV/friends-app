// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css'

import { db } from './firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { Home } from './pages/Home/Home';
function App() {


  return (
    <BrowserRouter>
        <div className='app-container'>
        <Header />
        <Routes>
          <Route path="/" element={< Home />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
