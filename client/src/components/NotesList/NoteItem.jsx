import styles from "./NotesList.module.css";

export default function NoteItem({
    note,
    index,
    searchQuery,
    onEdit,
    onDelete,
    onToggleLock,
    onToggleFavorite, //wire later
}){
    //---Helpers-----------

    return(
        <li className={styles.noteItem}>
      <div
        className={styles.noteText}
        onClick={() => onEdit(index)}
      >
        <strong>{highlightMatch(smartTruncate(note.title, 15))}</strong>
        <p>{highlightMatch(smartTruncate(note.content, 12))}</p>
      </div>

      <div className={styles.noteIcons}>
        {/* Favorite */}
        <span
          className={styles.favorite}
          title="Favorite"
          onClick={() => onToggleFavorite?.(note)}
        >
          ⭐
        </span>

        {/* Lock */}
        <span
          className={styles.lockIcon}
          title={note.locked ? "Unlock" : "Lock"}
          onClick={() =>
            onToggleLock?.(note.id || note._id, note.locked)
          }
        >
          {note.locked ? "🔒" : "🔓"}
        </span>

        {/* More */}
        <span
          className={styles.more}
          title="More Actions"
          onClick={() => {
            /* open popup later */
          }}
        >
          ⋮
        </span>

        {/* Trash */}
        <span
          className={styles.trashIcon}
          title="Delete"
          onClick={() => onDelete(note.id || note._id)}
        >
          🗑
        </span>
      </div>
    </li>
    )
}