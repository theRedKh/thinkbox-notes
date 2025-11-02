import { useState, useRef, useEffect } from "react";
import { useState, useRef, useEffect } from "react";
import styles from "./NotesList.module.css";
import expandIcon from "../../assets/expand_content_googlefonts.svg";
import collapseIcon from "../../assets/collapse_content_googlefonts.svg";

export default function NotesList({ notes, setNotes, searchQuery, setSearchQuery, onEdit, api }) {
  const [activeTab, setActiveTab] = useState("new");
  const listRef = useRef(null);
export default function NotesList() {
  const containerRef = useRef(null);

  const [width, setWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("new");

  // ---------- Handle resizing ----------
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
    document.body.style.cursor = isResizing ? "ew-resize" : "";
    document.body.style.userSelect = isResizing ? "none" : "";
  }, [isResizing]);

  // ---------- API Handlers ----------
  const handleAddNote = async () => {
    try {
      const res = await fetch(`${api}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled Note", content: "" }),
      });
      const newNote = await res.json();
      setNotes((prev) => [newNote, ...prev]);
      onEdit(0);
      setActiveTab("search");
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await fetch(`${api}/notes/${id}`, { method: "DELETE" });
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const toggleLock = async (id, currentLock) => {
    try {
      const res = await fetch(`${api}/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locked: !currentLock }),
      });
      const updated = await res.json();
      setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
    } catch (err) {
      console.error("Error toggling lock:", err);
    }
  };

  // ---------- Helpers ----------
  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const smartTruncate = (text, maxLength = 15) => {
    const plain = stripHtml(text);
    return plain.length > maxLength ? plain.slice(0, maxLength) + "…" : plain;
  };

  const highlightMatch = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className={styles.highlight}>{part}</mark>
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

  useEffect(() => {
    if (listRef.current && activeTab === "search") {
      listRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [notes, activeTab]);

  // ---------- JSX ----------
  return (
    <div
      ref={containerRef}
      className={`${styles.notesListContainer} ${isFullscreen ? styles.fullscreen : ""}`}
      style={{
        width: isHidden ? "0px" : isFullscreen ? "100%" : `${width}px`,
        flex: isFullscreen ? "1 1 auto" : "0 0 auto",
        transition: isResizing ? "none" : "width 0.2s ease",
      }}
    >
      {!isHidden && (
        <>
          {/* Header */}
          <div className={styles.header}>
            <button
              className={styles.fullscreenBtn}
              onClick={() => setIsFullscreen((s) => !s)}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              <img
                src={isFullscreen ? collapseIcon : expandIcon}
                alt="toggle fullscreen"
                style={{
                  transform: isFullscreen ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              />
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
          <ul ref={listRef} className={styles.list} ref={listRef}>
            {filteredNotes.map((note) => (
              <li key={note._id} className={styles.noteItem}>
                <div className={styles.noteText}>
                  <strong>{highlightMatch(smartTruncate(smartTruncate(note.title, 18), 15))}</strong>
                  <p>{highlightMatch(smartTruncate(smartTruncate(note.content, 15), 12))}</p>
                </div>
                <div className={styles.noteIcons}>
                  <span
                   
                className="material-icons"
                   
                title={note.locked ? "Unlock" : "Lock"}
                onClick={() => toggleLock(index)}
              
                    onClick={() => toggleLock(note._id, note.locked)}
                  >
                    {note.locked ? "lock" : "lock_open"}
                  </span>
                  <span
               
                    className="material-icons"
               
                    title="Edit"
                onClick={() => onEdit(index)}
              
                    onClick={() => onEdit(note._id)}
                  >
                    edit
                  </span>
                  <span
                    className="material-icons"
                    title="Delete"
                    onClick={() => handleDeleteNote(note._id)}
                  >
                    delete
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Resizer + Hide tab */}
      <div className={styles.resizer} onMouseDown={startResize}></div>
      <div
        className={styles.hideTab}
        onClick={() => setIsHidden((s) => !s)}
        title={isHidden ? "Show Notes" : "Hide Notes"}
      >
        {isHidden ? "→" : "←"}
      </div>
    </div>
  );
}
