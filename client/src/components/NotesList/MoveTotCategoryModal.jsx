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
                onClick={(e)=> e.stopPropagation()} //
            >
                <h4 className={styles.modalTitle}>Move to...</h4>

                <ul className={styles.categoryList}>
                    {categories.map((cat) => (
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