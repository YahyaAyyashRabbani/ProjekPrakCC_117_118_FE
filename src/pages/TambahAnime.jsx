import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance"; // pastikan path axiosInstance benar
import "./Tambah.css";

function TambahAnime() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [imgURL, setimgURL] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!accessToken) {
      alert("Silakan login terlebih dahulu untuk mengakses halaman ini.");
      navigate("/login");
    }
  }, [accessToken, navigate]);

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
      img_URL: imgURL.trim(), // pastikan nama field sesuai backend (img_URL bukan imgURL)
    };

    const res = await axios.post("/add-anime", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Jangan set Content-Type, axios akan set otomatis jadi application/json
      },
    });
    
      alert("Anime berhasil ditambahkan!");
      setTitle("");
      setDescription("");
      setGenre("");
      setYear("");
      setimgURL("");
      navigate("/admin-dashboard");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Gagal menambahkan anime");
    }
  };

  return (
    <div className="tambah-anime-wrapper">
      <a href="/dashboard" className="back-link" aria-label="Kembali ke dashboard">
        ← Kembali ke Dashboard
      </a>

      <h1 className="form-title">Tambah Anime Baru dengan Upload Gambar</h1>

      <form
        className="tambah-anime-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
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

        <label htmlFor="imgURL">Upload Gambar Cover</label>
        <input
          type="text"
          id="imgURL"
          name="imgURL"
          placeholder="www.ini-link-foto.com"
          className="input-file"
          accept="image/*"
          onChange={(e) => setimgURL(e.target.value)}
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
          Tambah Anime
        </button>
      </form>
    </div>
  );
}

export default TambahAnime;
