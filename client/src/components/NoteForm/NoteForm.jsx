import styles from "./NoteForm.module.css"
export default function NoteForm() {
    return (
        <div className={styles.container}>
            <button className={styles.close}> x </button>
            <input placeholder="Title" className={styles.title}/>
            <p className={styles.dateTime}></p>
            <textarea placeholder="What's on your mind..."></textarea>
        </div>
    );
}