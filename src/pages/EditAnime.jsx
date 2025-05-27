import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axiosInstance";
import "./Tambah.css";

function EditAnime() {
  const { id } = useParams(); // ambil id anime dari URL
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      alert("Silakan login terlebih dahulu untuk mengakses halaman ini.");
      navigate("/login");
      return;
    }
    // Fetch data anime by id
    const fetchAnime = async () => {
      try {
        const res = await axios.get(`/anime/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const anime = res.data.data || res.data;
        setTitle(anime.title || "");
        setDescription(anime.description || "");
        setGenre(anime.genre || "");
        setYear(anime.year || "");
        setImgURL(anime.img_URL || "");
      } catch (err) {
        setErrorMsg(err.response?.data?.message || err.message || "Gagal mengambil data anime");
      } finally {
        setLoading(false);
      }
    };
    fetchAnime();
  }, [id, accessToken, navigate]);

  const validateYear = (yr) => /^\d{4}$/.test(yr);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim() || !description.trim() || !genre || !year.trim() || !imgURL) {
      setErrorMsg("Semua bidang wajib diisi, termasuk gambar.");
      return;
    }

    if (!validateYear(year.trim())) {
      setErrorMsg("Format tahun harus 4 digit, contoh: 2023.");
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        genre,
        year: year.trim(),
        img_URL: imgURL.trim(),
      };

      await axios.put(`/update-anime/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      alert("Anime berhasil diperbarui!");
      navigate("/admin-dashboard"); // atau ke dashboard admin sesuai rute
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Gagal memperbarui anime");
    }
  };

  if (loading) {
    return <p>Loading data anime...</p>;
  }

  return (
    <div className="tambah-anime-wrapper">
      <a href="/admin-dashboard" className="back-link" aria-label="Kembali ke dashboard admin">
        ← Kembali ke Dashboard Admin
      </a>

      <h1 className="form-title">Edit Anime</h1>

      <form
        className="tambah-anime-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <label htmlFor="title">Judul Anime</label>
        <input
          type="text"
          id="title"
          name="title"
          className="input-text"
          placeholder="Masukkan judul anime"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          aria-required="true"
        />

        <label htmlFor="description">Deskripsi</label>
        <textarea
          id="description"
          name="description"
          className="textarea"
          placeholder="Deskripsi singkat anime"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          aria-required="true"
        />

        <label htmlFor="genre">Genre</label>
        <select
          id="genre"
          name="genre"
          className="select"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
          aria-required="true"
        >
          <option value="" disabled>
            Pilih genre...
          </option>
          {[
            "Action",
            "Adventure",
            "Comedy",
            "Drama",
            "Ecchi",
            "Fantasy",
            "Horror",
            "Mystery",
            "Romance",
            "Sci-Fi",
            "Slice of Life",
            "Supernatural",
            "Thriller",
            "Sports",
            "School",
          ].map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <label htmlFor="year">Tahun Rilis</label>
        <input
          type="text"
          id="year"
          name="year"
          className="input-text"
          placeholder="Contoh: 2023"
          pattern="^\d{4}$"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          aria-required="true"
        />

        <label htmlFor="imgURL">Link Gambar Cover</label>
        <input
          type="text"
          id="imgURL"
          name="imgURL"
          placeholder="www.link-gambar.com"
          className="input-file"
          value={imgURL}
          onChange={(e) => setImgURL(e.target.value)}
          required
          aria-required="true"
        />

        {errorMsg && (
          <div
            className="error-message"
            role="alert"
            aria-live="assertive"
          >
            {errorMsg}
          </div>
        )}

        <button type="submit" className="btn-submit">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}

export default EditAnime;
