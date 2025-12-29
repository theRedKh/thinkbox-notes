import styles from "./NotesList.module.css";

export default function MoveToCategoryModal({
    categories,
    currentCategory,
    onSelect,
    onClose,
}) {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={styles.modal}
                onClick={(e)=> e.stopPropagation()} //prevents clicking inside to close modal issue
            >
                <h4 className={styles.modalTitle}>Move to...</h4>

                <ul className={styles.categoryList}>
                    {categories.map((folder) => ( //map categories from an imported list of categories to each list item -- dynamic modal
                        <li
                            key={folder.id}
                            className={`${styles.categoryItem} ${
                                folder.id === currentCategory ? styles.activeCategory : ""
                            }`}
                            onClick={() => onSelect(folder.id)}
                        >
                            {folder.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}