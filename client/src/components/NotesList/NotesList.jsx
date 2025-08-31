import { useState } from "react";
import styles from "./NotesList.module.css";

export default function NotesList() {
  const [notes, setNotes] = useState([
    { title: "First Note", content: "Content of first note", locked: false },
    { title: "Shopping List", content: "Eggs, Milk, Bread", locked: true },
    { title: "Ideas", content: "React app for students", locked: false },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("new"); // "new" or "search"

  const handleAddNote = () => {
    const newNote = { title: "Untitled Note", content: "", locked: false };
    setNotes([newNote, ...notes]);
    setActiveTab("search"); // switch to search/edit view after adding
  };

  const handleDeleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  // Highlights matching text
  const highlightMatch = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className={styles.highlight}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Filter notes by search
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.notesListContainer}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={activeTab === "new" ? styles.activeTab : ""}
          onClick={handleAddNote}
        >
          + New Note
        </button>
        <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setActiveTab("search")}
        />

      </div>

      {/* Notes List */}
      <ul className={styles.list}>
        {filteredNotes.map((note, index) => (
          <li key={index} className={styles.noteItem}>
            <div className={styles.noteText}>
              <strong>{highlightMatch(note.title)}</strong>
              <p>{highlightMatch(note.content)}</p>
            </div>
            <div className={styles.noteIcons}>
              <span className="material-icons" title="Lock">
                {note.locked ? "lock" : "lock_open"}
              </span>
              <span className="material-icons" title="Edit">
                edit
              </span>
              <span
                className="material-icons"
                title="Delete"
                onClick={() => handleDeleteNote(index)}
              >
                delete
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
