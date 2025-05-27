import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axiosInstance"; // pastikan path benar
import "./Tambah.css";

function TambahReview() {
  const navigate = useNavigate();
  const { id: animeId } = useParams();

  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!accessToken) {
      alert("Silakan login terlebih dahulu untuk mengakses halaman ini.");
      navigate("/login");
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    console.log(animeId);
    if (!animeId) {
      setErrorMsg("Anime tidak diketahui. Tidak dapat menambah review.");
    }
  }, [animeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!rating) {
      setErrorMsg("Pilih rating terlebih dahulu.");
      return;
    }
    if (comment.trim().length < 10) {
      setErrorMsg("Komentar minimal 10 karakter.");
      return;
    }

    if (!accessToken) {
      setErrorMsg("Kamu harus login terlebih dahulu untuk menambah review.");
      return;
    }

    try {
      const res = await axios.post(
        "/add-review",  // sesuaikan endpoint sesuai backend-mu
        {
          animeId: parseInt(animeId),
          rating: parseInt(rating),
          comment: comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      alert("Review berhasil ditambahkan!");
      navigate(`/detail/${animeId}`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Gagal menambah review");
    }
  };

  if (!animeId) {
    return (
      <div className="tambah-anime-wrapper">
        <a href="/" className="back-link" aria-label="Kembali ke beranda">
          ← Kembali ke Beranda
        </a>
        <h1>Tambah Review Anime</h1>
        <div className="error-message" role="alert" aria-live="assertive">
          {errorMsg}
        </div>
      </div>
    );
  }

  return (
    <div className="tambah-anime-wrapper">
      <a href="/" className="back-link" aria-label="Kembali ke beranda">
        ← Kembali ke Beranda
      </a>
      <h1>Tambah Review Anime</h1>
      <form id="reviewForm" onSubmit={handleSubmit} encType="multipart/form-data" noValidate className="tambah-anime-form">
        <label htmlFor="rating">Rating</label>
        <select
          id="rating"
          name="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
          aria-required="true"
        >
          <option value="" disabled>
            Pilih rating...
          </option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {"⭐".repeat(num)} {num}
            </option>
          ))}
        </select>

        <label htmlFor="comment">Komentar</label>
        <textarea
          id="comment"
          name="comment"
          placeholder="Tulis komentar kamu di sini..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          aria-required="true"
          minLength={10}
        />

        {errorMsg && (
          <div className="error-message" role="alert" aria-live="assertive">
            {errorMsg}
          </div>
        )}

        <button type="submit">Kirim Review</button>
      </form>
    </div>
  );
}

export default TambahReview;
