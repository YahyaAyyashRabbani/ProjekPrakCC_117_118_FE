// import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import untuk routing
import Login from "../pages/Login"; // Halaman login
import Register from "../pages/Register";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Detail from "../pages/Detail";
import TambahAnime from "../pages/TambahAnime";
import TambahReview from "../pages/TambahReview";
import EditReview from "../pages/EditReview";
import AdminDashboard from "../pages/DashboardAdmin";
import EditAnime from "../pages/EditAnime";

function RouterApp() {
  return (
    <Router>
      <Routes>
        {/* Pass setIsAuthenticated as prop to LoginPage */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/detail/:id" element={<Detail />}/>
        <Route path="/tambah-anime" element={<TambahAnime />}/>
        <Route path="/tambah-review/:id" element={<TambahReview />}/>
        <Route path="/edit-anime/:id" element={<EditAnime />}/>
        <Route path="/edit-review/:id" element={<EditReview />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default RouterApp;