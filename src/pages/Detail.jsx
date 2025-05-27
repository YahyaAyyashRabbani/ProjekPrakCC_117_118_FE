import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance"; // pastikan path sesuai
import "./Detail.css";

function Detail() {
  const { id: animeId } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userId, setUserId] = useState(null); // Simpan user ID yang login
  const [errorAnime, setErrorAnime] = useState(null);
  const [errorReviews, setErrorReviews] = useState(null);
  const [loadingAnime, setLoadingAnime] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!accessToken) {
      alert("Silakan login terlebih dahulu untuk mengakses halaman detail.");
      navigate("/login");
      return;
    }
    // Ambil user yang login
    axios.get("/user", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(res => {
        setUserId(res.data.id);
      })
      .catch(err => {
        console.error("Gagal mengambil profil user:", err);
      });
  }, [accessToken, navigate]);

  useEffect(() => {
    if (!animeId) {
      setErrorAnime("Anime tidak ditemukan. ID tidak tersedia.");
      setLoadingAnime(false);
      setLoadingReviews(false);
      return;
    }
    fetchAnimeDetail(animeId);
    fetchReviews(animeId);
  }, [animeId]);

  async function fetchAnimeDetail(id) {
    setLoadingAnime(true);
    try {
      const res = await axios.get(`/anime/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setAnime(res.data.data);
      setErrorAnime(null);
    } catch (error) {
      setErrorAnime(error.response?.data?.message || error.message || "Error fetching anime detail");
      setAnime(null);
    } finally {
      setLoadingAnime(false);
    }
  }

  async function fetchReviews(id) {
    setLoadingReviews(true);
    try {
      const res = await axios.get(`/review-anime/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setReviews(res.data.data);
      setErrorReviews(null);
    } catch (error) {
      setErrorReviews(error.response?.data?.message || error.message || "Error fetching reviews");
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  }

  // Cek apakah user sudah pernah review anime ini
  const userHasReviewed = userId && reviews.some((rev) => rev.user.id === userId);
  console.log(reviews.some((rev) => rev.user.id === userId)); 

  function handleAddReview() {
    if (!animeId) {
      alert("ID anime tidak ditemukan.");
      return;
    }
    navigate(`/tambah-review/${animeId}`);
  }

  const handleLogout = () => {
    if (window.confirm("Yakin ingin logout?")) {
      localStorage.removeItem("accessToken");
      alert("Logout berhasil!");
      navigate("/login");
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="nav-bar" aria-label="Navigasi utama">
        <div className="logo" onClick={() => navigate("/")}>ANIMEREV</div>
        <div>
          {accessToken ? (
            <>
              <button
                className="nav-button"
                onClick={() => navigate("/dashboard")}
                style={{ marginRight: "10px" }}
              >
                Dashboard
              </button>
              <button className="nav-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="nav-button" onClick={() => navigate("/login")}>Login</button>
              <button className="nav-button" onClick={() => navigate("/register")}>Register</button>
            </>
          )}
        </div>
      </nav>

      <main className="main-content">
        <button
          onClick={() => navigate("/")}
          className="back-link"
          aria-label="Kembali ke halaman beranda"
        >
          ← Kembali ke Beranda
        </button>

        {loadingAnime ? (
          <section className="anime-detail-container" aria-live="polite">
            <p>Loading data anime...</p>
          </section>
        ) : errorAnime ? (
          <section aria-live="polite" className="error-text">
            {errorAnime}
          </section>
        ) : anime ? (
          <section
            className="anime-detail-container"
            tabIndex={0}
            aria-live="polite"
            aria-label="Detail anime"
          >
            <div
              className="anime-img"
              tabIndex={0}
              aria-label="Gambar cover anime"
            >
              <img
                src={anime.img_URL}
                alt={`Cover anime ${anime.title}`}
                loading="lazy"
              />
            </div>
            <div className="anime-info">
              <h1>{anime.title}</h1>
              <div
                className="anime-meta"
                aria-label="Informasi genre, tahun rilis, dan rating"
              >
                <span className="genre-badge">
                  {anime.genre || "Unknown"}
                </span>
                <span>Tahun: {anime.year || "-"}</span>
                <span>
                  Rating: {anime.avgRating ? `⭐ ${anime.avgRating.toFixed(1)}` : "-"}
                </span>
              </div>
              <div className="anime-description">
                {anime.description || "Deskripsi belum tersedia."}
              </div>
            </div>
          </section>
        ) : null}

        <section className="reviews-section" aria-label="Daftar review pengguna">
          <h2>Review Pengguna</h2>

          {/* Hanya tampilkan tombol jika user belum review */}
          {!userHasReviewed && (
            <button
              className="btn-add-review"
              onClick={handleAddReview}
              aria-label="Tambah review baru"
            >
              + Tambah Review
            </button>
          )}

          {loadingReviews ? (
            <p>Loading review...</p>
          ) : errorReviews ? (
            <p className="error-text">Error: {errorReviews}</p>
          ) : reviews.length === 0 ? (
            <p className="no-reviews">Belum ada review untuk anime ini.</p>
          ) : (
            reviews.map((rev) => (
              <article
                key={rev.id}
                className="review-card"
                tabIndex={0}
                aria-label={`Review dari pengguna ${rev.user?.username || "Unknown"}`}
              >
                <div className="review-author">{rev.user?.username || "Unknown"}</div>
                <div className="review-rating" aria-label="Rating bintang">
                  {"⭐".repeat(rev.rating)}
                </div>
                <div className="review-text">{rev.comment}</div>
              </article>
            ))
          )}
        </section>
      </main>

      <footer className="footer">&copy; 2025 Anime Review. All rights reserved.</footer>
    </>
  );
}

export default Detail;
