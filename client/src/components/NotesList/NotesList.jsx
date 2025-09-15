import { useState, useRef, useEffect } from "react";
import styles from "./NotesList.module.css";

export default function NotesList() {
  const containerRef = useRef(null);

  const [width, setWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const startResize = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || isFullscreen || isHidden) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const newWidth = e.clientX - rect.left;
      const clamped = Math.max(180, Math.min(newWidth, 600));
      setWidth(clamped);
    };

    const handleMouseUp = () => setIsResizing(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, isFullscreen, isHidden]);

  useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  // dummy notes
  const [notes, setNotes] = useState([
    { title: "First Note", content: "Content of first note", locked: false },
    { title: "Shopping List", content: "Eggs, Milk, Bread", locked: true },
    { title: "Ideas", content: "React app for students", locked: false },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("new");

  const handleAddNote = () => {
    const newNote = { title: "Untitled Note", content: "", locked: false };
    setNotes([newNote, ...notes]);
    setActiveTab("search");
  };

  const handleDeleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

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

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      ref={containerRef}
      className={`${styles.notesListContainer} ${
        isFullscreen ? styles.fullscreen : ""
      }`}
      style={{
        width: isHidden ? "0px" : isFullscreen ? "100%" : `${width}px`,
        flex: isFullscreen ? "1 1 auto" : "0 0 auto",
        transition: isResizing ? "none" : "width 0.2s ease",
      }}
    >
      {!isHidden && (
        <>
          {/* Header (fullscreen button here) */}
          <div className={styles.header}>
            <button
              className={styles.fullscreenBtn}
              onClick={() => setIsFullscreen((s) => !s)}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              <span className="material-icons">
                {isFullscreen ? "fullscreen_exit" : "fullscreen"}
              </span>
            </button>
          </div>

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
        </>
      )}

      {/* RESIZER + Hide tab */}
      <div className={styles.resizer} onMouseDown={startResize}>
        <div
          className={styles.hideTab}
          onClick={() => setIsHidden((s) => !s)}
          title={isHidden ? "Show Notes" : "Hide Notes"}
        >
          <span className="material-icons">
            {isHidden ? "chevron_right" : "chevron_left"}
          </span>
        </div>
      </div>
    </div>
  );
}
