import styles from "./NoteForm.module.css";
import Toolbar from "../Toolbar/Toolbar";
export default function NoteForm() {
    return (
        <div className={styles.container}>
            <input placeholder="Title" className={styles.title}/>
            <textarea className={styles.noteArea} placeholder="What's on your mind..."></textarea>
             <Toolbar/>
        </div>
    );
}