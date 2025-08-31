import { useState } from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const [folders, setFolders] = useState(["Work", "Personal", "Ideas"]);
  const [addingFolder, setAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState(null); // folder currently being renamed
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
        <li>All</li>
        <li>Favorites</li>
        <li>Trash</li>
      </ul>

      {/* Folders section */}
      <h3 className={styles.sectionTitle}>Folders</h3>
      <ul className={styles.list}>
        {folders.map((folder, index) => (
          <li key={folder + index} className={styles.newFolder}>
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
                  className={`material-icons ${styles.renameIcon}`}
                  onClick={() => handleRenameFolder(folder)}
                >
                  edit
                </span>
                <span
                  className={`material-icons ${styles.trashIcon}`}
                  onClick={() => handleDeleteFolder(folder)}
                >
                  delete
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
