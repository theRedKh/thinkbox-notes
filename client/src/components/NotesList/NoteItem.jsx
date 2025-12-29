import styles from "./NotesList.module.css";
import { useState } from "react";
import MoveToCategoryModal from "./MoveToCategoryModal";
import { BUILT_IN_FOLDERS } from "../../config/categories";

export default function NoteItem({
    note,
    index,
    folders = [],
    searchQuery,
    onEdit,
    onFavorite,
    onTrash,
    onRestore,
    onDelete,
    onToggleLock,
    onMoveCategory,
    selectedFolder,
}){

    const customCategories = folders.map(f => ({ id: f, name: f }));
    const allCategories = [...BUILT_IN_FOLDERS, ...customCategories];

    const [showMoveModal, setShowMoveModal] = useState(false);
    //--------Helpers-----------
    const stripHtml = (html) => {
    //this is a security feature, as well as cleaning visuals
    //strips html tags for output and input
        if (!html) return "";
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
  };

  //smart truncate, to reduce title sizes according to space available. Min space allows 15 chars
  const smartTruncate = (text, maxLength = 15) => {
    const plain = stripHtml(text);
    return plain.length > maxLength ? plain.slice(0, maxLength) + "…" : plain;
  };

  //highlight search feature, when user searches for text, search result is highlighted
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

    return(
      <>
        <li className={styles.noteItem}>
          <div
            className={styles.noteText}
            onClick={() => onEdit(note.id || note._id)}
          >
            <strong>{highlightMatch(smartTruncate(note.title, 15))}</strong>
            <p>{highlightMatch(smartTruncate(note.content, 12))}</p>
          </div>

        <div className={styles.noteIcons}>
          {selectedFolder === "Trash" ? (
            <>
              <span
                className={styles.restoreIcon}
                title="Restore"
                onClick={(e) => { e.stopPropagation(); onRestore?.(note.id || note._id); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M0.833313 3.33334V8.33334M0.833313 8.33334H5.83331M0.833313 8.33334L4.69998 4.70001C5.85074 3.55119 7.34369 2.80748 8.95388 2.58094C10.5641 2.35439 12.2043 2.65729 13.6273 3.44398C15.0504 4.23067 16.1793 5.45854 16.8438 6.94259C17.5084 8.42664 17.6726 10.0865 17.3118 11.672C16.951 13.2575 16.0847 14.6828 14.8434 15.7331C13.6021 16.7835 12.0531 17.402 10.4297 17.4954C8.80638 17.5888 7.19663 17.1522 5.84303 16.2512C4.48943 15.3502 3.46531 14.0337 2.92498 12.5" 
                    stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>

              <span
                className={styles.trashIcon}
                title="Delete permanently"
                onClick={(e) => { e.stopPropagation(); onDelete?.(note.id || note._id); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 21" fill="none">
                  <path d="M2.625 5.25H4.375M4.375 5.25H18.375M4.375 5.25V17.5C4.375 17.9641 4.55937 18.4092 4.88756 18.7374C5.21575 19.0656 5.66087 19.25 6.125 19.25H14.875C15.3391 19.25 15.7842 19.0656 16.1124 18.7374C16.4406 18.4092 16.625 17.9641 16.625 17.5V5.25M7 5.25V3.5C7 3.03587 7.18437 2.59075 7.51256 2.26256C7.84075 1.93437 8.28587 1.75 8.75 1.75H12.25C12.7141 1.75 13.1592 1.93437 13.4874 2.26256C13.8156 2.59075 14 3.03587 14 3.5V5.25" 
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </>
          ) : (
            <>
              {/* Favorite */}
              <span
                className={styles.favorite}
                title={note.isFavorite ? "Unfavorite" : "Favorite"}
                onClick={(e) => { e.stopPropagation(); onFavorite?.(note.id || note._id, note.isFavorite); }}
              >
                {note.isFavorite ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="#FFD166">
                    <path d="M8.00001 1.33333L10.06 5.50666L14.6667 6.18L11.3333 9.42666L12.12 14.0133L8.00001 11.8467L3.88001 14.0133L4.66668 9.42666L1.33334 6.18L5.94001 5.50666L8.00001 1.33333Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8.00001 1.33333L10.06 5.50666L14.6667 6.18L11.3333 9.42666L12.12 14.0133L8.00001 11.8467L3.88001 14.0133L4.66668 9.42666L1.33334 6.18L5.94001 5.50666L8.00001 1.33333Z" 
                    stroke="#1E1E1E" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>

              {/* Lock */}
              <span
                className={styles.lockIcon}
                title={note.locked ? "Unlock" : "Lock"}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLock?.(note.id || note._id, note.locked)
                }
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

              {/* More */}
              <span
                className={styles.more}
                title="More Actions"
                onClick={(e) => {
                  e.stopPropagation();
                  if (note.locked) return;
                  setShowMoveModal(true)
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 10.8333C10.4603 10.8333 10.8334 10.4602 10.8334 10C10.8334 9.53976 10.4603 9.16666 10 9.16666C9.53978 9.16666 9.16669 9.53976 9.16669 10C9.16669 10.4602 9.53978 10.8333 10 10.8333Z" 
                    strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 4.99999C10.4603 4.99999 10.8334 4.6269 10.8334 4.16666C10.8334 3.70642 10.4603 3.33333 10 3.33333C9.53978 3.33333 9.16669 3.70642 9.16669 4.16666C9.16669 4.6269 9.53978 4.99999 10 4.99999Z" 
                    strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 16.6667C10.4603 16.6667 10.8334 16.2936 10.8334 15.8333C10.8334 15.3731 10.4603 15 10 15C9.53978 15 9.16669 15.3731 9.16669 15.8333C9.16669 16.2936 9.53978 16.6667 10 16.6667Z" 
                    strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              </span>

              {/* Trash */}
              <span
                className={styles.trashIcon}
                title="Trash"
                onClick={(e) => { e.stopPropagation(); onTrash?.(note.id || note._id); }}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 21 21" fill="none">
                      <path d="M2.625 5.25H4.375M4.375 5.25H18.375M4.375 5.25V17.5C4.375 17.9641 4.55937 18.4092 4.88756 18.7374C5.21575 19.0656 5.66087 19.25 6.125 19.25H14.875C15.3391 19.25 15.7842 19.0656 16.1124 18.7374C16.4406 18.4092 16.625 17.9641 16.625 17.5V5.25M7 5.25V3.5C7 3.03587 7.18437 2.59075 7.51256 2.26256C7.84075 1.93437 8.28587 1.75 8.75 1.75H12.25C12.7141 1.75 13.1592 1.93437 13.4874 2.26256C13.8156 2.59075 14 3.03587 14 3.5V5.25" 
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              </span>
            </>
          )}
        </div>
      </li>

      {showMoveModal && (
        <MoveToCategoryModal
          categories={allCategories}
          currentCategory={note.category}
          onClose={() => setShowMoveModal(false)}
          onSelect={(folderId) => {
            onMoveCategory(note.id || note._id, folderId);
            setShowMoveModal(false);
          }}
        />
      )}
    </>
  );
}