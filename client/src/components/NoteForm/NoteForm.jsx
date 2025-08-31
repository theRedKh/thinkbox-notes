import { useEffect, useState } from "react";
import styles from "./NoteForm.module.css";

export default function NoteForm({ note, setNotes, noteIndex, searchQuery }) {
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

  // Highlight search matches in editor
  const highlightMatch = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className={styles.highlight}>
          {part}
        </mark>
      ) : (
        part
      )
    );
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
        {note &&
          note.created.toLocaleString("en-US", {
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
      {/* Optional: live preview with highlights */}
      {searchQuery && (
        <div className={styles.preview}>
          <strong>{highlightMatch(title)}</strong>
          <p>{highlightMatch(content)}</p>
        </div>
      )}
    </div>
  );
}
