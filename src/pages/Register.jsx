import React, { useState } from 'react';
import './login.css';
import { useNavigate, Link } from 'react-router-dom';
import { BASE_URL } from '../utils/utils';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validasi password sama atau tidak
    if (password !== confirmPassword) {
      setErrorMsg('Password dan konfirmasi password harus sama.');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || 'Gagal melakukan registrasi.');
        return;
      }

      alert('Registrasi berhasil! Silakan login.');
      navigate('/login'); // Redirect ke login setelah register sukses
    } catch (err) {
      setErrorMsg('Terjadi kesalahan: ' + err.message);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h2>Daftar Akun Baru</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username Anda"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Kata sandi Anda"
            required
          />

          <label htmlFor="confirmPassword">Konfirmasi Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi kata sandi"
            required
          />

          {errorMsg && (
            <div className="error-message" role="alert" aria-live="assertive">
              {errorMsg}
            </div>
          )}

          <button type="submit">Register</button>
        </form>
        <div className="form-footer">
          Sudah punya akun? <Link to="/">Masuk di sini</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
