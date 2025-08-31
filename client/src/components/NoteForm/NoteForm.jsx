import { useEffect, useState } from "react";
import styles from "./NoteForm.module.css";
import Toolbar from "../Toolbar/Toolbar";

export default function NoteForm({ note, setNotes, noteIndex }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [note]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (noteIndex !== null) {
      setNotes((prev) => {
        const copy = [...prev];
        copy[noteIndex].title = e.target.value;
        return copy;
      });
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (noteIndex !== null) {
      setNotes((prev) => {
        const copy = [...prev];
        copy[noteIndex].content = e.target.value;
        return copy;
      });
    }
  };

  return (
    <div className={styles.container}>
      <input
        placeholder="Title"
        className={styles.title}
        value={title}
        onChange={handleTitleChange}
      />
      <p className={styles.dateTime}>
        {note && note.created.toLocaleString("en-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}
      </p>
      <textarea
        className={styles.noteArea}
        placeholder="What's on your mind..."
        value={content}
        onChange={handleContentChange}
      />
      <Toolbar/>
    </div>
  );
}
