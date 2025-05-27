import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Detail.css";
import { BASE_URL } from "../utils/utils";

function Home() {
  const navigate = useNavigate();
  const [animeList, setAnimeList] = useState([]);
  const [filteredAnime, setFilteredAnime] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Ambil token dan role dari localStorage
  const accessToken = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("role"); // asumsikan kamu simpan role saat login

  async function fetchWithAuth(url, options = {}) {
    if (!accessToken) return null;
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
    const res = await fetch(url, options);
    if (res.status === 401 || res.status === 403) {
      alert("Sesi habis, silakan login ulang.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      navigate("/login");
      return null;
    }
    return res;
  }

  async function loadAnime() {
    try {
      const res = accessToken
        ? await fetchWithAuth(`${BASE_URL}/anime`)
        : await fetch(`${BASE_URL}/anime`);

      if (!res || !res.ok) throw new Error("Gagal mengambil daftar anime");
      const data = await res.json();
      console.log(data)
      setAnimeList(data.data);
      setFilteredAnime(data.data);
    } catch (err) {
      setAnimeList([]);
      setFilteredAnime([]);
      console.error(err);
    }
  }

  useEffect(() => {
    loadAnime();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAnime(animeList);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = animeList.filter((anime) =>
        anime.title.toLowerCase().includes(lowerSearch)
      );
      setFilteredAnime(filtered);
    }
  }, [searchTerm, animeList]);

  const handleLogout = () => {
    if (window.confirm("Yakin ingin logout?")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      alert("Logout berhasil!");
      navigate("/login");
    }
  };

  return (
    <div className="home-wrapper">
      {/* Navbar */}
      <nav className="nav-bar" aria-label="Navigasi utama">
        <div className="logo" onClick={() => navigate("/")}>
          ANIMEREV
        </div>
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
              <button className="nav-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="nav-button" onClick={() => navigate("/login")}>
                Login
              </button>
              <button
                className="nav-button"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="main-content" aria-label="Konten utama halaman home">
        <h1 className="page-title">Daftar Anime</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Cari anime..."
            aria-label="Cari anime"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredAnime.length === 0 ? (
          <p>Login terlebih dahulu untuk melihat daftar anime.</p>
        ) : (
          <div className="anime-grid" role="list">
            {filteredAnime.map((anime) => (
              <article
                key={anime.id}
                className="anime-card"
                role="listitem"
                tabIndex={0}
                aria-label={`Anime ${anime.title}`}
                onClick={() => navigate(`/detail/${anime.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/detail/${anime.id}`);
                  }
                }}
              >
                <div className="anime-img-wrapper">
                  <img
                    src={anime.imageUrl || anime.img_URL || ""}
                    alt={`Cover anime ${anime.title}`}
                    loading="lazy"
                  />
                </div>
                <h2 className="anime-title">{anime.title}</h2>
                <p className="anime-genre">{anime.genre}</p>
                <p className="anime-year">Tahun: {anime.year}</p>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer" aria-label="Footer halaman">
        &copy; 2025 Anime Review. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
