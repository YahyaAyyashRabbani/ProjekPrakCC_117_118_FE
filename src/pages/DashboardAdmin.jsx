import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance"; // pastikan path axiosInstance benar
import "./Detail.css";

function AdminDashboard() {
  const [adminData, setAdminData] = useState({
    id: null,
    username: "",
    email: "",
  });
  const [animeList, setAnimeList] = useState([]);
  const [reviewList, setReviewList] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeView, setActiveView] = useState("anime"); // 'anime' atau 'review'
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      alert("Silakan login terlebih dahulu.");
      navigate("/login");
    }
  }, [accessToken, navigate]);

  // Load admin profile
  useEffect(() => {
    const loadAdminProfile = async () => {
      try {
        const res = await axios.get("/user", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setAdminData({
          id: res.data.id,
          username: res.data.username,
          email: res.data.email || "",
        });
      } catch (err) {
        console.error("Gagal mengambil profil admin:", err);
      }
    };
    if (accessToken) loadAdminProfile();
  }, [accessToken]);

  // Load anime list dan review list
  useEffect(() => {
    const loadAnimeAndReviews = async () => {
      try {
        const [animeRes, reviewRes] = await Promise.all([
          axios.get("/anime", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get("/review-all", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);
        setAnimeList(animeRes.data.data || animeRes.data);
        setReviewList(reviewRes.data.data || reviewRes.data);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        setErrorMsg(err.message);
      }
    };
    if (accessToken) loadAnimeAndReviews();
  }, [accessToken]);

  // Logout
  const handleLogout = () => {
    if (window.confirm("Yakin ingin logout?")) {
      localStorage.removeItem("accessToken");
      alert("Logout berhasil!");
      navigate("/login");
    }
  };

  // Edit anime
  const handleEditAnime = (id) => {
    navigate(`/edit-anime/${id}`);
  };

  // Delete anime
  const handleDeleteAnime = async (id) => {
    if (!window.confirm("Yakin ingin menghapus anime ini?")) return;
    try {
      await axios.delete(`/delete-anime/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      alert("Anime berhasil dihapus");
      setAnimeList((prev) => prev.filter((anime) => anime.id !== id));
    } catch (err) {
      alert("Error hapus anime: " + err.message);
    }
  };

  // Delete review
  const handleDeleteReview = async (id) => {
    if (!window.confirm("Yakin ingin menghapus review ini?")) return;
    try {
      await axios.delete(`/delete-review/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      alert("Review berhasil dihapus");
      setReviewList((prev) => prev.filter((review) => review.id !== id));
    } catch (err) {
      alert("Error hapus review: " + err.message);
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      {/* Navbar */}
      <nav className="nav-bar" role="navigation" aria-label="Main navigation">
        <div
          className="logo"
          tabIndex={0}
          role="link"
          onClick={() => (window.location.href = "/")}
          onKeyDown={(e) => e.key === "Enter" && (window.location.href = "/")}
        >
          ANIMEREV ADMIN
        </div>
        <div>
          <button
            className="nav-button"
            onClick={() => navigate("/tambah-anime")}
            style={{ marginRight: "10px" }}
          >
            Tambah Anime
          </button>
          <button className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Profile Admin */}
      <section className="user-info" aria-label="Profil admin">
        <h2>Profil Admin</h2>
        <p>
          <strong>Nama:</strong> {adminData.username || "-"}
        </p>
        <p>
          <strong>Status:</strong> Admin
        </p>
      </section>

      {/* Statistik */}
      <section className="stats" aria-label="Statistik umum" style={{ display: "flex", gap: "2rem" }}>
        <div
          className="stat-card"
          aria-label="Jumlah anime"
          onClick={() => setActiveView("anime")}
          style={{ cursor: "pointer" }}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter") setActiveView("anime"); }}
        >
          <h3>{animeList.length}</h3>
          <p>Total Anime</p>
        </div>
        <div
          className="stat-card"
          aria-label="Jumlah review"
          onClick={() => setActiveView("review")}
          style={{ cursor: "pointer" }}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter") setActiveView("review"); }}
        >
          <h3>{reviewList.length}</h3>
          <p>Total Review</p>
        </div>
      </section>

      {/* Konten Dinamis */}
      {activeView === "anime" ? (
        <section className="anime-list" aria-label="Daftar anime" style={{ marginTop: "1rem" }}>
          <h2 style={{ marginLeft: "20px" }}>Daftar Anime</h2>
          {errorMsg && <p className="error-text">{errorMsg}</p>}
          {animeList.length === 0 ? (
            <p>Tidak ada anime yang tersedia.</p>
          ) : (
            <table className="anime-table" aria-label="Tabel daftar anime">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Genre</th>
                  <th>Tahun</th>
                  <th>Cover</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {animeList.map((anime) => (
                  <tr key={anime.id}>
                    <td>{anime.title}</td>
                    <td>{anime.genre}</td>
                    <td>{anime.year}</td>
                    <td>
                      <img
                        src={anime.img_URL}
                        alt={`Cover anime ${anime.title}`}
                        style={{ width: "80px", height: "auto" }}
                      />
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        aria-label={`Edit anime ${anime.title}`}
                        onClick={() => handleEditAnime(anime.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        aria-label={`Hapus anime ${anime.title}`}
                        onClick={() => handleDeleteAnime(anime.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      ) : (
        <section className="review-list" aria-label="Daftar review">
          <h2 style={{ marginLeft: "20px" }}>Daftar Review</h2>
          {errorMsg && <p className="error-text">{errorMsg}</p>}
          {reviewList.length === 0 ? (
            <p>Tidak ada review yang tersedia.</p>
          ) : (
            <table className="review-table" aria-label="Tabel daftar review">
              <thead>
                <tr>
                  <th>ID Review</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>User ID</th>
                  <th>Anime ID</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {reviewList.map((review) => (
                  <tr key={review.id}>
                    <td>{review.id}</td>
                    <td>{"⭐".repeat(Number(review.rating))}</td>
                    <td>{review.comment}</td>
                    <td>{review.userId}</td>
                    <td>{review.anime_id}</td>
                    <td>
                      <button
                        className="delete-btn"
                        aria-label={`Hapus review ID ${review.id}`}
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {/* Footer */}
      <footer className="footer">&copy; 2025 Anime Review. All rights reserved.</footer>
    </div>
  );
}

export default AdminDashboard;
