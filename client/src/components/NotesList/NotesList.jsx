import { useState } from "react";
import styles from "./NotesList.module.css";

export default function NotesList({ notes, searchQuery, setSearchQuery, setNotes, onEdit }) {
  const [activeTab, setActiveTab] = useState("new"); // "new" or "search"

  const handleAddNote = () => {
    const newNote = {
      title: "Untitled Note",
      content: "",
      locked: false,
      created: new Date(),
    };
    setNotes([newNote, ...notes]);
    onEdit(0); // open the new note in the editor
    setActiveTab("search"); 
  };

  const handleDeleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const toggleLock = (index) => {
    setNotes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], locked: !copy[index].locked }; // ✅ new object
      return copy;
    });
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

  // Smart truncation
  const smartTruncate = (text) => {
    const maxLength = 15;
    if (!searchQuery) {
      return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
    }
    const index = text.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (index === -1) return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
    // Show snippet around match
    const start = Math.max(index - 7, 0);
    const end = Math.min(index + searchQuery.length + 7, text.length);
    let snippet = text.slice(start, end);
    if (start > 0) snippet = "…" + snippet;
    if (end < text.length) snippet = snippet + "…";
    return snippet;
  };

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
              <p>{highlightMatch(smartTruncate(note.content))}</p>
            </div>
            <div className={styles.noteIcons}>
              <span
                className="material-icons"
                title={note.locked ? "Unlock" : "Lock"}
                onClick={() => toggleLock(index)}
              >
                {note.locked ? "lock" : "lock_open"}
              </span>
              <span
                className="material-icons"
                title="Edit"
                onClick={() => onEdit(index)}
              >
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
