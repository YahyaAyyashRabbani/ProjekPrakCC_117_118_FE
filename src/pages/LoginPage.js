import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login(username, password);
      if (result) {
        navigate("/notes");
      } else {
        setError("Login failed: invalid username or password");
      }
    } catch (error) {
      setError("Login failed: " + (error.response?.data?.message || error.message));
    }
  };

  // Inline style objek
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f3f4f6",
      padding: "20px",
    },
    box: {
      backgroundColor: "white",
      padding: "32px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      width: "320px",
      boxSizing: "border-box",
    },
    title: {
      fontSize: "24px",
      fontWeight: "700",
      marginBottom: "24px",
      textAlign: "center",
      color: "#111827",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: "#4b5563",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      fontSize: "16px",
      borderRadius: "6px",
      border: "1px solid #d1d5db",
      marginBottom: "16px",
      boxSizing: "border-box",
      outline: "none",
      transition: "border-color 0.3s",
    },
    inputFocus: {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59,130,246,0.3)",
    },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#3b82f6",
      color: "white",
      fontWeight: "700",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "16px",
      transition: "background-color 0.3s",
    },
    buttonHover: {
      backgroundColor: "#2563eb",
    },
    error: {
      color: "#dc2626",
      marginTop: "12px",
      fontSize: "14px",
      textAlign: "center",
      fontWeight: "600",
    },
    footerText: {
      marginTop: "24px",
      fontSize: "14px",
      color: "#6b7280",
      textAlign: "center",
    },
    link: {
      color: "#3b82f6",
      textDecoration: "none",
      cursor: "pointer",
    },
  };

  // Untuk menambah efek focus pada input, kita pakai state sederhana:
  const [focusedInput, setFocusedInput] = useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Login</h2>
        <form
          onSubmit={handleLogin}
          noValidate
          autoComplete="off"
        >
          <label htmlFor="username" style={styles.label}>
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            onFocus={() => setFocusedInput("username")}
            onBlur={() => setFocusedInput(null)}
            style={{
              ...styles.input,
              ...(focusedInput === "username" ? styles.inputFocus : {}),
            }}
          />

          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            onFocus={() => setFocusedInput("password")}
            onBlur={() => setFocusedInput(null)}
            style={{
              ...styles.input,
              ...(focusedInput === "password" ? styles.inputFocus : {}),
            }}
          />

          <button
            type="submit"
            style={styles.button}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
          >
            Login
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        <p style={styles.footerText}>
          Belum punya Akun?{" "}
          <Link to="/register" style={styles.link}>
            Daftar Disini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
