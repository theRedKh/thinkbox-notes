import { useState, useRef, useEffect } from "react";
import styles from "./NotesList.module.css";
import expandIcon from "../../assets/expand_content_googlefonts.svg";
import collapseIcon from "../../assets/collapse_content_googlefonts.svg";
import NoteItem from "./NoteItem";

export default function NotesList({
  notes,
  folders,
  searchQuery,
  setSearchQuery,
  selectedFolder,
  onAdd,
  onDelete,
  onEdit,
  onToggleLock,
  onFavorite,
  onTrash,
  onRestore,
  onMoveCategory
})
 {
  const containerRef = useRef(null);
  const listRef = useRef(null);

  const [width, setWidth] = useState(360);
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

  //-------------------------------Filtering------------------------

  const filteredNotes = notes.filter((n) => {
    // Exclude trashed notes from all views except the Trash tab
    if (selectedFolder !== "Trash" && n.isTrashed) return false;

    const matchesFolder =
      selectedFolder === "All" ? true :
      selectedFolder === "Favorites" ? (n.isFavorite && !n.isTrashed) :
      selectedFolder === "Trash" ? n.isTrashed :
      (n.category === selectedFolder && !n.isTrashed);

    const q = (searchQuery || "").toLowerCase();
    const title = (n.title || "").toLowerCase();
    const content = (n.content || "").toLowerCase();

    const matchesSearch = title.includes(q) || content.includes(q);

    return matchesFolder && matchesSearch;
  });

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
              <NoteItem
                key={note.id || note._id}
                note={note}
                index={index}
                folders={folders}
                selectedFolder={selectedFolder}
                searchQuery={searchQuery}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleLock={onToggleLock}
                onFavorite={onFavorite}
                onTrash={onTrash}
                onRestore={onRestore}
                onMoveCategory={onMoveCategory}
              />
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
