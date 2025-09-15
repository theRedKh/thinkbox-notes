import { useState, useRef, useEffect } from "react";
import styles from "./NotesList.module.css";

export default function NotesList({ notes, searchQuery, setSearchQuery, setNotes, onEdit }) {
  const [activeTab, setActiveTab] = useState("new");
  const listRef = useRef(null); // ref to the notes list
export default function NotesList() {
  const [width, setWidth] = useState(250); //initial width
  const [isResizing, setResizing] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const listRef = useRef(null); // ref to the notes list
  const startResize = () => setIsResizing(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing && !isFullscreen && !isHidden) {
        setWidth(Math.max(180, Math.min(e.clientX, 600))); 
        // min 180px, max 600px
      }
    };
    const handleMouseUp = () => setIsResizing(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, isFullscreen, isHidden]);


  const [notes, setNotes] = useState([
    { title: "First Note", content: "Content of first note", locked: false },
    { title: "Shopping List", content: "Eggs, Milk, Bread", locked: true },
    { title: "Ideas", content: "React app for students", locked: false },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("new"); // "new" or "search"

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

  // Filter notes by search
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
    {/* Toolbar */}
      <div>
        <button onClick={() => setIsHidden(!isHidden)}>
          {isHidden ? "Show": "Hide"}
        </button>
        <button onClick={() => setIsFullscreen(!isFullscreen)}>
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>

      </div>
    <div className={styles.notesListContainer}
    style={{
    width: isHidden ? "0px" : isFullscreen ? "100%" : `${width}px`,
    flex: isFullscreen ? "1 1 auto" : "0 0 auto",
    transition: isResizing ? "none" : "width 0.2s ease"
    }} >
      
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
      {isFullscreen && (
        <div className={styles.resizer} onMouseDown={startResize}></div>
      )}
      </>
      )}
    </div>
    </>
  );
}
