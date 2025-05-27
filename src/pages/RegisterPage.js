import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils.js";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama!");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/register`,
        { username, password, confirm_password: confirmPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.data) {
        navigate("/login");
      } else {
        setError("Registrasi gagal, coba lagi.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Terjadi kesalahan");
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f3f4f6",
      padding: 20,
    },
    box: {
      backgroundColor: "white",
      padding: 32,
      borderRadius: 8,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      width: 320,
      boxSizing: "border-box",
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 24,
      textAlign: "center",
      color: "#111827",
    },
    label: {
      display: "block",
      fontSize: 14,
      fontWeight: "600",
      color: "#4b5563",
      marginBottom: 8,
    },
    input: {
      width: "100%",
      padding: 10,
      fontSize: 16,
      borderRadius: 6,
      border: "1px solid #d1d5db",
      marginBottom: 16,
      boxSizing: "border-box",
      outline: "none",
      transition: "border-color 0.3s",
    },
    button: {
      width: "100%",
      padding: 12,
      backgroundColor: "#3b82f6",
      color: "white",
      fontWeight: "700",
      fontSize: 16,
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    buttonHover: {
      backgroundColor: "#2563eb",
    },
    error: {
      color: "#dc2626",
      fontSize: 14,
      marginBottom: 12,
      textAlign: "center",
      fontWeight: "600",
    },
    footerText: {
      marginTop: 24,
      fontSize: 14,
      color: "#6b7280",
      textAlign: "center",
    },
    link: {
      color: "#3b82f6",
      textDecoration: "none",
      cursor: "pointer",
    },
  };

  // Simple hover effect for button
  const [btnHover, setBtnHover] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Register</h2>
        <form onSubmit={handleRegister} noValidate autoComplete="off">
          <label htmlFor="username" style={styles.label}>
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />

          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <label htmlFor="confirmPassword" style={styles.label}>
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={styles.input}
          />

          <button
            type="submit"
            style={{
              ...styles.button,
              backgroundColor: btnHover ? styles.buttonHover.backgroundColor : styles.button.backgroundColor,
            }}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            Register
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        <p style={styles.footerText}>
          Sudah Punya Akun?{" "}
          <Link to="/login" style={styles.link}>
            Login Disini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
