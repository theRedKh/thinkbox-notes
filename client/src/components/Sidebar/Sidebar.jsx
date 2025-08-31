import styles from "./Sidebar.module.css";
export default function Sidebar() {
    return(
        <div className={styles.sidebar}>
            <ul>
                <li>All Notes</li>
                <li>Favorites</li>
                <li>Trash</li>
            </ul>
        </div> 
    );
}