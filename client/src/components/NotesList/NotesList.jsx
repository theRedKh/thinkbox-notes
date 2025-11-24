import { useState, useRef, useEffect } from "react";
import styles from "./NotesList.module.css";
import expandIcon from "../../assets/expand_content_googlefonts.svg";
import collapseIcon from "../../assets/collapse_content_googlefonts.svg";

export default function NotesList({
  notes,
  setNotes,
  searchQuery,
  setSearchQuery,
  onEdit,
  api,
}) {
  const containerRef = useRef(null);
  const listRef = useRef(null);

  const [width, setWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("new");

  // ------------------ Resizing panel ------------------
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

    const stop = () => setIsResizing(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stop);
    };
  }, [isResizing, isFullscreen, isHidden]);

  useEffect(() => {
    document.body.style.cursor = isResizing ? "ew-resize" : "";
    document.body.style.userSelect = isResizing ? "none" : "";
  }, [isResizing]);

  // ------------------ API Handlers ------------------
  const handleAddNote = async () => {
    try {
      const res = await fetch(`${api}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled Note", content: "" }),
      });

      const newNote = await res.json();
      setNotes((prev) => [newNote, ...prev]);
      onEdit(newNote._id);
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

  const toggleLock = async (id, locked) => {
    try {
      const res = await fetch(`${api}/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locked: !locked }),
      });

      const updated = await res.json();
      setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
    } catch (err) {
      console.error("Error toggling lock:", err);
    }
  };

  // ------------------ Helpers ------------------
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
      part.match(regex) ? (
        <mark key={i} className={styles.highlight}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (listRef.current && activeTab === "search") {
      listRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [notes, activeTab]);

  // ------------------ JSX ------------------
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
          {/* --- Header --- */}
          <div className={styles.header}>
            <button
              className={styles.fullscreenBtn}
              onClick={() => setIsFullscreen((s) => !s)}
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

          {/* --- Tabs --- */}
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
              onFocus={() => setActiveTab("search")}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* --- Notes List --- */}
          <ul ref={listRef} className={styles.list}>
            {filteredNotes.map((note) => (
              <li key={note._id} className={styles.noteItem}>
                <div className={styles.noteText}>
                  <strong>
                    {highlightMatch(smartTruncate(note.title, 15))}
                  </strong>
                  <p>{highlightMatch(smartTruncate(note.content, 12))}</p>
                </div>

                <div className={styles.noteIcons}>
                  <span
                    className="material-icons"
                    title={note.locked ? "Unlock" : "Lock"}
                    onClick={() => toggleLock(note._id, note.locked)}
                  >
                    {note.locked ? "lock" : "lock_open"}
                  </span>

                  <span
                    className="material-icons"
                    title="Edit"
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

      {/* --- Resizer + Hide Button --- */}
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
