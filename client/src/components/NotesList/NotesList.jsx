import { useState, useRef, useEffect } from "react";
import styles from "./NotesList.module.css";
import expandIcon from "../../assets/expand_content_googlefonts.svg";
import collapseIcon from "../../assets/collapse_content_googlefonts.svg";

export default function NotesList({
  notes,
  searchQuery,
  setSearchQuery,
  onAdd,
  onDelete,
  onEdit,
  onToggleLock,
}) {
  const containerRef = useRef(null);
  const listRef = useRef(null);

  const [width, setWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
      setWidth(Math.max(180, Math.min(newWidth, 600)));
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

  const searchRef = useRef(null);
  const handleSearchFocus = () => {
    listRef.current?.scrollTo({top: 0, behavior: "smooth"});
  }
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
              className={styles.newNote}
              onClick={onAdd}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11 13H5V11H11V5H13V11H19V13H13V19H11V13Z" fill="#6B7565"/>
              </svg>
              New
            </button>

            <input
              className={styles.searchAside}
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onFocus={handleSearchFocus}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* --- Notes List --- */}
          <ul ref={listRef} className={styles.list}>
            {filteredNotes.map((note, index) => (
              <li key={note.id || note._id || index} className={styles.noteItem}>
                <div className={styles.noteText}>
                  <strong>{highlightMatch(smartTruncate(note.title, 15))}</strong>
                  <p>{highlightMatch(smartTruncate(note.content, 12))}</p>
                </div>

                <div className={styles.noteIcons}>
                  <span
                    className={styles.favorite}
                    title="Favorite"
                    onClick={true}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8.00001 1.33333L10.06 5.50666L14.6667 6.18L11.3333 9.42666L12.12 14.0133L8.00001 11.8467L3.88001 14.0133L4.66668 9.42666L1.33334 6.18L5.94001 5.50666L8.00001 1.33333Z" 
                      stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>

                  <span
                    className={styles.lockIcon}
                    title={note.locked ? "Unlock" : "Lock"}
                    onClick={() =>
                      onToggleLock && onToggleLock(note.id || note._id, note.locked)
                    }
                  >
                    {note.locked ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4.66667 7.33333V4.66666C4.66667 3.78261 5.01786 2.93476 5.64298 2.30964C6.2681 1.68452 7.11595 1.33333 8 1.33333C8.88406 1.33333 9.7319 1.68452 10.357 2.30964C10.9821 2.93476 11.3333 3.78261 11.3333 4.66666V7.33333M3.33333 7.33333H12.6667C13.403 7.33333 14 7.93028 14 8.66666V13.3333C14 14.0697 13.403 14.6667 12.6667 14.6667H3.33333C2.59695 14.6667 2 14.0697 2 13.3333V8.66666C2 7.93028 2.59695 7.33333 3.33333 7.33333Z" stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4.66667 7.33333V4.66666C4.66584 3.84003 4.97219 3.04257 5.52625 2.42911C6.08031 1.81564 6.84255 1.42993 7.665 1.34685C8.48745 1.26378 9.31143 1.48926 9.97698 1.97954C10.6425 2.46981 11.1022 3.18989 11.2667 4M3.33333 7.33333H12.6667C13.403 7.33333 14 7.93028 14 8.66666V13.3333C14 14.0697 13.403 14.6667 12.6667 14.6667H3.33333C2.59695 14.6667 2 14.0697 2 13.3333V8.66666C2 7.93028 2.59695 7.33333 3.33333 7.33333Z" stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                      
                  {/*<span
                    className={styles.editIcon}
                    title="Edit"
                    onClick={() => onEdit(index)}
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M14.1667 2.49999C14.3855 2.28112 14.6454 2.1075 14.9313 1.98905C15.2173 1.8706 15.5238 1.80963 15.8333 1.80963C16.1429 1.80963 16.4494 1.8706 16.7353 1.98905C17.0213 2.1075 17.2811 2.28112 17.5 2.49999C17.7189 2.71886 17.8925 2.97869 18.0109 3.26466C18.1294 3.55063 18.1904 3.85713 18.1904 4.16665C18.1904 4.47618 18.1294 4.78268 18.0109 5.06865C17.8925 5.35461 17.7189 5.61445 17.5 5.83332L6.25 17.0833L1.66667 18.3333L2.91667 13.75L14.1667 2.49999Z" 
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  </span> */}
                  <span
                    className={styles.more}
                    title="More Actions"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 10.8333C10.4603 10.8333 10.8334 10.4602 10.8334 10C10.8334 9.53976 10.4603 9.16666 10 9.16666C9.53978 9.16666 9.16669 9.53976 9.16669 10C9.16669 10.4602 9.53978 10.8333 10 10.8333Z" 
                      stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 4.99999C10.4603 4.99999 10.8334 4.6269 10.8334 4.16666C10.8334 3.70642 10.4603 3.33333 10 3.33333C9.53978 3.33333 9.16669 3.70642 9.16669 4.16666C9.16669 4.6269 9.53978 4.99999 10 4.99999Z" 
                      stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 16.6667C10.4603 16.6667 10.8334 16.2936 10.8334 15.8333C10.8334 15.3731 10.4603 15 10 15C9.53978 15 9.16669 15.3731 9.16669 15.8333C9.16669 16.2936 9.53978 16.6667 10 16.6667Z" 
                      stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span
                    className={styles.trashIcon}
                    title="Delete"
                    onClick={() => onDelete(note.id || note._id)}
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 21 21" fill="none">
                    <path d="M2.625 5.25H4.375M4.375 5.25H18.375M4.375 5.25V17.5C4.375 17.9641 4.55937 18.4092 4.88756 18.7374C5.21575 19.0656 5.66087 19.25 6.125 19.25H14.875C15.3391 19.25 15.7842 19.0656 16.1124 18.7374C16.4406 18.4092 16.625 17.9641 16.625 17.5V5.25M7 5.25V3.5C7 3.03587 7.18437 2.59075 7.51256 2.26256C7.84075 1.93437 8.28587 1.75 8.75 1.75H12.25C12.7141 1.75 13.1592 1.93437 13.4874 2.26256C13.8156 2.59075 14 3.03587 14 3.5V5.25" 
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
