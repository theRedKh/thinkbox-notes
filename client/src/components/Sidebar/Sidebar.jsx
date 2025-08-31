import { useState } from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
    const [folders, setFolders] = useState(["Work", "Personal", "Ideas"]);

    const addFolder = () => {
        const name = prompt("Enter folder name:");
        if (name && !folders.includes(name)) {
            setFolders([...folders, name]);
        }
    }

    return(
        <div className={styles.sidebar}>
            <ul>
                <li>All Notes</li>
                <li>Favorites</li>
                <li>Trash</li>
            </ul>
            {/* Folders section */}
            <h3 className={styles.sectionTitle}>Folders</h3>
            <ul className={styles.list}>
                {folders.map((folder, index) => (
                    <li key={index}>{folder}</li>
                ))}
            </ul>

            {/* Add Folder btn */}
            <button className={styles.addFolder} onClick={addFolder}> + Add Folder </button>
        </div> 
    );
}