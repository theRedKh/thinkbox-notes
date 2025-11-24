import { useState } from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const [folders, setFolders] = useState(["Work", "Personal", "Ideas"]);
  const [addingFolder, setAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("All"); // default selected

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
                  className={`material-icons ${styles.renameIcon}`}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent selecting folder
                    handleRenameFolder(folder);
                  }}
                >
                  edit
                </span>
                <span
                  className={`material-icons ${styles.trashIcon}`}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent selecting folder
                    handleDeleteFolder(folder);
                  }}
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
