import { useState } from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const [folders, setFolders] = useState(["Work", "Personal", "Ideas"]);
  const [addingFolder, setAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleAddFolder = () => {
    if (newFolderName.trim() && !folders.includes(newFolderName.trim())) {
      setFolders([...folders, newFolderName.trim()]);
    }
    setNewFolderName("");
    setAddingFolder(false);
  };

  const handleDeleteFolder = (folderName) => {
    setFolders(folders.filter((f) => f !== folderName));
  };

  const handleKeyPress = (e) => {
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
        <li>All</li>
        <li>Favorites</li>
        <li>Trash</li>
      </ul>

      {/* Folders section */}
      <h3 className={styles.sectionTitle}>Folders</h3>
      <ul className={styles.list}>
        {folders.map((folder, index) => (
          <li key={folder + index} className={styles.newFolder}>
            <span>{folder}</span>
            <span
              className={`material-icons ${styles.trashIcon}`}
              onClick={() => handleDeleteFolder(folder)}
            >
              delete
            </span>
          </li>
        ))}

        {addingFolder && (
          <li className={`${styles.folderInputWrapper} ${styles.active}`}>
            <input
              className={styles.folderInput}
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Folder name"
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
