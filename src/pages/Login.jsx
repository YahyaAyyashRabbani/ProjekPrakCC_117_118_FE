import React, { useState } from 'react';
import axios from '../api/axiosInstance'; // pastikan axiosInstance sudah disetup
import './login.css';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await axios.post('/login', {
        username,
        password,
      });

      // Simpan access token ke localStorage
      const { accessToken, role } = response.data;
      console.log(response.data);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('role', role.toString());
      localStorage.setItem('username', username);

      // Navigasi beda berdasarkan role
      if (role === 0) {
        // admin
        navigate('/admin-dashboard');
      } else if (role === 1) {
        // user biasa
        navigate('/');
      }
    } catch (error) {
      // Tangani error dari server
      if (error.response) {
        setErrorMsg(error.response.data.message || 'Login gagal');
      } else {
        setErrorMsg('Server tidak merespon');
      }
    }
  };

  return (
    <div className="page-wrapper">
      <div className="register-page">
        <div className="container">
          <h2>Masuk ke Anime Review</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="AyyashWibu123"
              required
              autoComplete="username"
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="**********"
              required
              autoComplete="current-password"
            />

            {errorMsg && (
              <div className="error-message" role="alert" aria-live="assertive">
                {errorMsg}
              </div>
            )}

            <button type="submit">Login</button>
          </form>
          <div className="form-footer">
            Belum punya akun? <Link to="/register">Daftar di sini</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
