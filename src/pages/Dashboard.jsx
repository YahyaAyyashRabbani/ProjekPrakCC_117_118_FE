  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import "./Detail.css";

  function Dashboard() {
    const [userData, setUserData] = useState({
      userId: 1,
      username: "ayyash",
      email: "ayyash@example.com",
    });

    const [animeList, setAnimeList] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [filterAnime, setFilterAnime] = useState("");
    const [filterRating, setFilterRating] = useState("");
    const [newReview, setNewReview] = useState({
      animeId: "",
      rating: "",
      comment: "",
    });
    const accessToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();

    useEffect(() => {
      if (!accessToken) {
        alert("Silakan login terlebih dahulu untuk mengakses halaman dashboard.");
        navigate("/login");
      }
    }, [accessToken, navigate]);

    useEffect(() => {
      async function loadUserProfile() {
        if (!accessToken) return;
        try {
          const res = await fetch(`${BASE_URL}/user`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (!res.ok) throw new Error("Gagal mengambil profil pengguna");
          const data = await res.json();
          setUserData({
            userId: data.id,
            username: data.username,
          });
        } catch (err) {
          console.error(err);
        }
      }
      loadUserProfile();
    }, [accessToken]);

    // Fungsi loadReviews sekarang di luar useEffect
    async function loadReviews() {
      try {
        let url = `${BASE_URL}/review`;
        const params = new URLSearchParams();
        if (filterAnime) params.append("animeId", filterAnime);
        if (filterRating) params.append("rating", filterRating);
        if ([...params].length) url += `?${params.toString()}`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error("Gagal mengambil review");
        const data = await res.json();
        console.log(data);
        setReviews(data.data || data); // Sesuaikan dengan struktur response
      } catch (err) {
        console.error(err);
        setReviews([]);
      }
    }

    useEffect(() => {
      if (accessToken) loadReviews();
    }, [userData.userId, filterAnime, filterRating, accessToken]);

    const totalReviews = reviews.length;
    const avgRating =
      totalReviews === 0
        ? "-"
        : (reviews.reduce((a, r) => a + Number(r.rating), 0) / totalReviews).toFixed(1);

    const handleEdit = (id) => {
      console.log("Edit review dengan id:", id);
      navigate(`/edit-review/${id}`);
    };

    const handleDelete = async (id) => {
      if (!window.confirm("Yakin ingin menghapus review ini?")) return;

      try {
        const res = await fetch(`${BASE_URL}/delete-review/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.ok) throw new Error("Gagal menghapus review");

        alert("Review berhasil dihapus");

        // Panggil ulang loadReviews agar UI ter-refresh otomatis
        await loadReviews();
      } catch (error) {
        alert("Error hapus review: " + error.message);
      }
    };

    // Logout handler
    function handleLogout() {
      if (window.confirm("Yakin ingin logout?")) {
        localStorage.removeItem("accessToken");
        alert("Logout berhasil!");
        navigate("/login");
      }
    }

    return (
      <div className="dashboard-wrapper">
        {/* Navbar */}
        <nav className="nav-bar" role="navigation" aria-label="Main navigation">
          <div
            className="logo"
            tabIndex={0}
            role="link"
            onClick={() => (window.location.href = "/")}
            onKeyDown={(e) => e.key === "Enter" && (window.location.href = "/")}
          >
            ANIMEREV
          </div>
          <div>
            <button
              className="nav-button"
              onClick={() => navigate("/")}
              style={{ marginRight: "10px" }}
            >
              Home
            </button>
            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          {/* Profil */}
          <section className="user-info" aria-label="Informasi pengguna">
            <h2>Profil Pengguna</h2>
            <p>
              <strong>Nama:</strong> {userData.username || "-"}
            </p>
            <p>
              <strong>Status:</strong> Wibu
            </p>
          </section>

          {/* Statistik */}
          <section className="stats" aria-label="Statistik review pengguna">
            <div className="stat-card" aria-label="Jumlah review yang sudah dibuat">
              <h3>{totalReviews}</h3>
              <p>Review dibuat</p>
            </div>
            <div className="stat-card" aria-label="Rating rata-rata dari semua review">
              <h3>{avgRating}</h3>
              <p>Rating rata-rata</p>
            </div>
          </section>

          {/* Daftar review */}
          <section className="review-list" aria-label="Daftar review pengguna">
            <h2>Review Saya</h2>
            {reviews.length === 0 ? (
              <p>Belum ada review yang sesuai filter.</p>
            ) : (
              reviews.map((review) => (
                <article
                  key={review.id}
                  className="review-card"
                  tabIndex={0}
                  aria-label={`Review anime ${review.animeTitle} dengan rating ${review.rating}`}
                >
                  <div className="review-anime-title">
                    <strong>Anime:</strong> {review.Anime.title || "Tidak diketahui"}
                  </div>
                  <div className="review-rating">
                    {"⭐".repeat(Number(review.rating))}
                  </div>
                  <div className="review-text">{review.comment}</div>

                  <div className="review-actions">
                    <button
                      className="edit-btn"
                      aria-label={`Edit review anime ${review.animeTitle}`}
                      onClick={() => handleEdit(review.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      aria-label={`Hapus review anime ${review.animeTitle}`}
                      onClick={() => handleDelete(review.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>

        </main>

        {/* Footer */}
        <footer className="footer">&copy; 2025 Anime Review. All rights reserved.</footer>
      </div>
    );
  }

  export default Dashboard;
