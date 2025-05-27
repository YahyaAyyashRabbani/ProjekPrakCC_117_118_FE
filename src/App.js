// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Impor semua halaman dari folder pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Detail from './pages/Detail';
import TambahAnime from './pages/TambahAnime';
import TambahReview from './pages/TambahReview';
import Home from './pages/Home';

function App() {
  return (
    <Routes>
      {/* Redirect dari root ke home */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Halaman utama setelah login */}
      <Route path="/home" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Halaman detail anime dengan parameter id */}
      <Route path="/detail/:id" element={<Detail />} />

      {/* Halaman tambah data */}
      <Route path="/tambah-anime" element={<TambahAnime />} />
      <Route path="/tambah-review" element={<TambahReview />} />

      {/* Halaman 404 Not Found */}
      <Route path="*" element={<h2 style={{textAlign: "center", marginTop: 50}}>404 - Halaman tidak ditemukan</h2>} />
    </Routes>
  );
}

export default App;
