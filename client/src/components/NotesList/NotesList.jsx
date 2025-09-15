import { useState, useRef, useEffect } from "react";
import { useState, useRef, useEffect } from "react";
import styles from "./NotesList.module.css";

export default function NotesList({ notes, searchQuery, setSearchQuery, setNotes, onEdit }) {
  const [activeTab, setActiveTab] = useState("new");
  const listRef = useRef(null); // ref to the notes list
export default function NotesList() {
  const containerRef = useRef(null);

  const [width, setWidth] = useState(250); // initial width
  const [isResizing, setIsResizing] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const startResize = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  // update width while dragging (compute width relative to container left)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || isFullscreen || isHidden) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const newWidth = e.clientX - rect.left; // mouse X relative to left of container
      const clamped = Math.max(180, Math.min(newWidth, 600)); // min/max
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

  // nice UX: change cursor + disable text selection while resizing
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

  // ---- demo notes state (kept your existing local state) ----
  const [notes, setNotes] = useState([
    { title: "First Note", content: "Content of first note", locked: false },
    { title: "Shopping List", content: "Eggs, Milk, Bread", locked: true },
    { title: "Ideas", content: "React app for students", locked: false },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("new");

  const handleAddNote = () => {
    const newNote = {
      title: "Untitled Note",
      content: "",
      locked: false,
      created: new Date(),
    };
    setNotes([newNote, ...notes]);
    onEdit(0);
    setActiveTab("search"); // switch to search/edit view
  };

  const handleDeleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const toggleLock = (index) => {
    setNotes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], locked: !copy[index].locked };
      return copy;
    });
  };

  // Truncate title/content smartly
  const smartTruncate = (text, maxLength = 15) => {
    if (!searchQuery) return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
    const index = text.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (index === -1) return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
    const start = Math.max(index - 7, 0);
    const end = Math.min(index + searchQuery.length + 7, text.length);
    let snippet = text.slice(start, end);
    if (start > 0) snippet = "…" + snippet;
    if (end < text.length) snippet = snippet + "…";
    return snippet;
  };

  // Highlight search matches
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

  // Scroll to top when a new note is added
  useEffect(() => {
    if (listRef.current && activeTab === "search") {
      listRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [notes, activeTab]);

  return (
    <>
      {/* Toolbar (you can move this inside the container if you prefer) */}
      <div style={{ padding: 8 }}>
        <button onClick={() => setIsHidden((s) => !s)}>
          {isHidden ? "Show" : "Hide"}
        </button>
        <button onClick={() => setIsFullscreen((s) => !s)} style={{ marginLeft: 8 }}>
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>
      </div>

      <div
        ref={containerRef}
        className={styles.notesListContainer}
        style={{
          width: isHidden ? "0px" : isFullscreen ? "100%" : `${width}px`,
          flex: isFullscreen ? "1 1 auto" : "0 0 auto",
          transition: isResizing ? "none" : "width 0.2s ease",
        }}
      >
        {!isHidden && (
          <>
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
            <ul className={styles.list} ref={listRef}>
              {filteredNotes.map((note, index) => (
                <li key={index} className={styles.noteItem}>
                  <div className={styles.noteText}>
                    <strong>{highlightMatch(smartTruncate(note.title, 18))}</strong>
                    <p>{highlightMatch(smartTruncate(note.content, 15))}</p>
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

            {/* RESIZER — show when NOT fullscreen */}
            {!isFullscreen && (
              <div
                className={styles.resizer}
                onMouseDown={(e) => startResize(e)}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize notes list"
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
