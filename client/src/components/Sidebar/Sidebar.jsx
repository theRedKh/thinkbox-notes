import { useState } from "react";
import styles from "./Sidebar.module.css";
import { BUILT_IN_FOLDERS } from "../../config/categories";

export default function Sidebar({folders, setFolders, selectedFolder, setSelectedFolder}) {

  const [addingFolder, setAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  
  const handleAddFolder = () => {
    if (newFolderName.trim() && !folders.includes(newFolderName.trim())) {
      setFolders([...folders, newFolderName.trim()]);
    }
    setNewFolderName("");
    setAddingFolder(false);
  };

  const handleDeleteFolder = (folderName) => {
    setFolders(folders.filter((f) => f !== folderName));
    if (selectedFolder === folderName) setSelectedFolder("All");
  };

  const handleRenameFolder = (folderName) => {
    setEditingFolder(folderName);
    setRenameValue(folderName);
  };

  const handleRenameSubmit = (e) => {
    if (e.key === "Enter") {
      if (renameValue.trim() && !folders.includes(renameValue.trim())) {
        setFolders(
          folders.map((f) => (f === editingFolder ? renameValue.trim() : f))
        );
        if (selectedFolder === editingFolder) setSelectedFolder(renameValue.trim());
      }
      setEditingFolder(null);
      setRenameValue("");
    }
    if (e.key === "Escape") {
      setEditingFolder(null);
      setRenameValue("");
    }
  };

  const handleKeyPressAdd = (e) => {
    if (e.key === "Enter") handleAddFolder();
    if (e.key === "Escape") {
      setAddingFolder(false);
      setNewFolderName("");
    }
  };

  return (
    <div className={styles.sidebar}>
      {/* Main categories */}
      <h3 className={styles.sectionTitle}>Categories</h3>
      <ul className={styles.list}>
        {["All", "Favorites", "Trash"].map((cat) => (
          <li
            key={cat}
            className={`${selectedFolder === cat ? styles.selected : ""}`}
            onClick={() => setSelectedFolder(cat)}
          >
            {cat}
          </li>
        ))}
      </ul>

      {/* Folders section */}
      <h3 className={styles.folderTitle}>Folders</h3>
      <ul className={styles.list}>
        {BUILT_IN_FOLDERS.map((f) => (
          <li
            key={f.id}
            className={`${selectedFolder === f.id ? styles.selected : ""}`}
            onClick={() => setSelectedFolder(f.id)}
          >
            {f.name}
          </li>
        ))}

        {folders.map((folder, index) => (
          <li
            key={folder + index}
            className={`${styles.newFolder} ${
              selectedFolder === folder ? styles.selected : ""
            }`}
            onClick={() => setSelectedFolder(folder)}
          >
            {editingFolder === folder ? (
              <input
                className={styles.folderRenameInput}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={handleRenameSubmit}
                autoFocus
              />
            ) : (
              <span>{folder}</span>
            )}
            {editingFolder !== folder && (
              <div className={styles.icons}>
                <span
                  className={styles.renameIcon}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent selecting folder
                    handleRenameFolder(folder);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M14.1667 2.49999C14.3855 2.28112 14.6454 2.1075 14.9313 1.98905C15.2173 1.8706 15.5238 1.80963 15.8333 1.80963C16.1429 1.80963 16.4494 1.8706 16.7353 1.98905C17.0213 2.1075 17.2811 2.28112 17.5 2.49999C17.7189 2.71886 17.8925 2.97869 18.0109 3.26466C18.1294 3.55063 18.1904 3.85713 18.1904 4.16665C18.1904 4.47618 18.1294 4.78268 18.0109 5.06865C17.8925 5.35461 17.7189 5.61445 17.5 5.83332L6.25 17.0833L1.66667 18.3333L2.91667 13.75L14.1667 2.49999Z" 
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span
                  className={styles.trashIcon}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent selecting folder
                    handleDeleteFolder(folder);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                  <path d="M2.625 5.25H4.375M4.375 5.25H18.375M4.375 5.25V17.5C4.375 17.9641 4.55937 18.4092 4.88756 18.7374C5.21575 19.0656 5.66087 19.25 6.125 19.25H14.875C15.3391 19.25 15.7842 19.0656 16.1124 18.7374C16.4406 18.4092 16.625 17.9641 16.625 17.5V5.25M7 5.25V3.5C7 3.03587 7.18437 2.59075 7.51256 2.26256C7.84075 1.93437 8.28587 1.75 8.75 1.75H12.25C12.7141 1.75 13.1592 1.93437 13.4874 2.26256C13.8156 2.59075 14 3.03587 14 3.5V5.25" 
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                </span>
              </div>
            )}
          </li>
        ))}
        {addingFolder && (
          <li className={`${styles.folderInputWrapper} ${styles.active}`}>
            <input
              className={styles.folderInput}
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={handleKeyPressAdd}
              placeholder="Folder Name..."
              autoFocus
            />
          </li>
        )}
      </ul>

      {!addingFolder && (
        <button
          className={`${styles.addFolderBtn} ${
            addingFolder ? styles.hidden : ""
          }`}
          onClick={() => setAddingFolder(true)}
        >
          + Add Folder
        </button>
      )}
    </div>
  );
}
