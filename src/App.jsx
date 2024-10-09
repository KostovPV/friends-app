// src/App.jsx
import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
function App() {
  

  return (
    <BrowserRouter>
    <div className='app-container'>
      <Header />
    </div>
    </BrowserRouter>
  );
}

export default App;
