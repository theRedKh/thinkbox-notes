import styles from "./NoteslIst.module.css";

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
                    {categories.map((cat) => ( //map categories from an imported list of categories to each list item -- dynamic modal
                        <li
                            key={cat}
                            className={`${styles.categoryItem} ${
                                cat === currentCategory ? styles.activeCategory : ""
                            }`}
                            onClick={() => onSelect(cat)}
                        >
                            {cat}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}