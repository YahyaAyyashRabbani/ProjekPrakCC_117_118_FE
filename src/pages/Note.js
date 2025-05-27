import { useState, useEffect } from "react";
import { BASE_URL } from "../utils.js";
import { useNavigate } from "react-router-dom";
import axios from '../api/axiosInstance.js';
import useAuth from "../auth/useAuth.js";

function NotesApp() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/notes`);
      setNotes(response.data.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const addNote = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      const response = await axios.post(`${BASE_URL}/add-note`, { title, content });
      if (response.data.data) {
        setNotes((prevNotes) => [...prevNotes, response.data.data]);
        setTitle("");
        setContent("");
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/delete-note/${id}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const toggleEditMode = (id) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, isEditing: !note.isEditing } : note
      )
    );
  };

  const handleInputChange = (id, field, value) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, [field]: value } : note
      )
    );
  };

  const saveNote = async (id, newTitle, newContent) => {
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const response = await axios.put(`${BASE_URL}/update-note/${id}`, {
        title: newTitle,
        content: newContent,
      });

      if (response.data.data) {
        await fetchNotes();
      } else {
        alert("Gagal simpan data");
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleRefresh = async () => {
    await fetchNotes();
  };

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f3f4f6",
      padding: 24,
      display: "flex",
      justifyContent: "center",
      boxSizing: "border-box",
    },
    card: {
      width: "100%",
      maxWidth: 768,
      backgroundColor: "#fff",
      borderRadius: 8,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      padding: 24,
      display: "flex",
      flexDirection: "column",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#1f2937",
    },
    buttonGroup: {
      display: "flex",
      gap: 12,
    },
    button: {
      padding: "10px 16px",
      borderRadius: 6,
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: 14,
      color: "#fff",
      transition: "background-color 0.3s",
    },
    buttonBlue: {
      backgroundColor: "#2563eb",
    },
    buttonRed: {
      backgroundColor: "#dc2626",
    },
    input: {
      width: "100%",
      padding: 12,
      marginBottom: 12,
      borderRadius: 6,
      border: "1px solid #d1d5db",
      fontSize: 16,
      boxSizing: "border-box",
      outline: "none",
    },
    textarea: {
      width: "100%",
      padding: 12,
      marginBottom: 12,
      borderRadius: 6,
      border: "1px solid #d1d5db",
      fontSize: 16,
      resize: "none",
      boxSizing: "border-box",
      outline: "none",
    },
    addButton: {
      padding: 14,
      borderRadius: 6,
      border: "none",
      cursor: "pointer",
      fontWeight: "700",
      fontSize: 16,
      color: "#fff",
      backgroundColor: "#16a34a",
      transition: "background-color 0.3s",
      width: "100%",
      marginBottom: 24,
    },
    addButtonHover: {
      backgroundColor: "#15803d",
    },
    notesList: {
      display: "flex",
      flexDirection: "column",
      gap: 16,
      maxHeight: 500,
      overflowY: "auto",
    },
    noteCard: {
      backgroundColor: "#f9fafb",
      borderRadius: 8,
      padding: 16,
      border: "1px solid #e5e7eb",
      display: "flex",
      flexDirection: "column",
    },
    noteTitle: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 8,
      color: "#111827",
    },
    noteContent: {
      fontSize: 16,
      color: "#374151",
      whiteSpace: "pre-line",
    },
    noteInput: {
      width: "100%",
      padding: 8,
      marginBottom: 8,
      borderRadius: 6,
      border: "1px solid #d1d5db",
      fontSize: 16,
      outline: "none",
      boxSizing: "border-box",
    },
    noteTextarea: {
      width: "100%",
      padding: 8,
      marginBottom: 8,
      borderRadius: 6,
      border: "1px solid #d1d5db",
      fontSize: 16,
      resize: "none",
      outline: "none",
      boxSizing: "border-box",
    },
    noteButtonGroup: {
      display: "flex",
      gap: 8,
      marginTop: 8,
    },
    noteButtonYellow: {
      flex: 1,
      padding: 10,
      backgroundColor: "#facc15",
      color: "#fff",
      borderRadius: 6,
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: 14,
      transition: "background-color 0.3s",
    },
    noteButtonRed: {
      flex: 1,
      padding: 10,
      backgroundColor: "#dc2626",
      color: "#fff",
      borderRadius: 6,
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: 14,
      transition: "background-color 0.3s",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Notes App</h1>
          <div style={styles.buttonGroup}>
            <button
              style={{ ...styles.button, ...styles.buttonBlue }}
              onClick={handleRefresh}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#1e40af")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = styles.buttonBlue.backgroundColor)}
            >
              Refresh
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonRed }}
              onClick={handleLogout}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#b91c1c")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = styles.buttonRed.backgroundColor)}
            >
              Logout
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          style={styles.textarea}
        />
        <button
          onClick={addNote}
          style={styles.addButton}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = styles.addButtonHover.backgroundColor)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = styles.addButton.backgroundColor)}
        >
          Add Note
        </button>

        <div style={styles.notesList}>
          {Array.isArray(notes) && notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} style={styles.noteCard}>
                {note.isEditing ? (
                  <>
                    <input
                      type="text"
                      value={note.title}
                      onChange={(e) =>
                        handleInputChange(note.id, "title", e.target.value)
                      }
                      style={styles.noteInput}
                    />
                    <textarea
                      value={note.content}
                      onChange={(e) =>
                        handleInputChange(note.id, "content", e.target.value)
                      }
                      rows={3}
                      style={styles.noteTextarea}
                    ></textarea>
                    <button
                      onClick={() => {
                        saveNote(note.id, note.title, note.content);
                        toggleEditMode(note.id);
                      }}
                      style={styles.noteButtonYellow}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#eab308")}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = styles.noteButtonYellow.backgroundColor)}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <h2 style={styles.noteTitle}>{note.title}</h2>
                    <p style={styles.noteContent}>{note.content}</p>
                  </>
                )}
                <div style={styles.noteButtonGroup}>
                  <button
                    onClick={() => toggleEditMode(note.id)}
                    style={styles.noteButtonYellow}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#eab308")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = styles.noteButtonYellow.backgroundColor)}
                  >
                    {note.isEditing ? "Cancel" : "Edit"}
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    style={styles.noteButtonRed}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#b91c1c")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = styles.noteButtonRed.backgroundColor)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#6b7280" }}>No notes available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotesApp;
