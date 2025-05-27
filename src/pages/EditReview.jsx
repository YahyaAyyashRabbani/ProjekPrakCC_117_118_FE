import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Tambah.css";

function EditReview() {
  const { id: reviewId } = useParams();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  // State untuk review yang diedit
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch data review saat mount
  useEffect(() => {
    if (!accessToken) {
      alert("Silakan login terlebih dahulu.");
      navigate("/login");
      return;
    }
    if (!reviewId) {
      setErrorMsg("ID review tidak ditemukan.");
      return;
    }

    async function fetchReview() {
      try {
        const res = await fetch(`http://localhost:5000/review/${reviewId}`, {
          headers: { Authorization: `Bearer ${accessToken}`},
        });
        if (!res.ok) throw new Error("Gagal mengambil data review");
        const data = await res.json();
        console.log(data);
        // Asumsikan data review punya rating dan comment
        setRating(data.data.rating.toString());
        setComment(data.data.comment);
      } catch (error) {
        setErrorMsg(error.message);
      }
    }

    fetchReview();
  }, [accessToken, navigate, reviewId]);

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

    try {
      const res = await fetch(`http://localhost:5000/update-review/${reviewId}`, {
        method: "PUT", // atau PATCH, sesuai backend
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          rating: parseInt(rating),
          comment: comment.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal mengupdate review");
      }

      alert("Review berhasil diupdate!");
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="tambah-anime-wrapper">
      <a href="/dashboard" className="back-link" aria-label="Kembali ke dashboard">
        ← Kembali ke Dashboard
      </a>

      <h1 className="form-title">Edit Review</h1>

      {errorMsg && (
        <div className="error-message" role="alert" aria-live="assertive">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="rating">Rating</label>
        <select
          id="rating"
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
          placeholder="Tulis komentar kamu di sini..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          aria-required="true"
          minLength={10}
        />

        <button type="submit" className="btn-submit">
          Update Review
        </button>
      </form>
    </div>
  );
}

export default EditReview;
