import { useEffect, useState, useRef } from "react";
import styles from "./NoteForm.module.css";
import Toolbar from "../Toolbar/Toolbar";
import hideIcon from "../../assets/hide_googlefonts.svg";

export default function NoteForm({ note, onUpdate, searchQuery, onClose }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showSavedToast, setShowSavedToast] = useState(false);

  const textareaRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  // Load selected note
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [note]);

  // cleanup toast timeout if component unmounts
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Save note to backend
  const handleSave = async () => {
    if (!note) return;
    try {
      await onUpdate(note.id, { title, content });
      // show toast instead of alert
      setShowSavedToast(true);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => setShowSavedToast(false), 2500);
    } catch (err){
      console.error("Failed to save note:", err);
    }
  };
  
  // Content editing in textarea
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };
  
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Highlight search matches
  const highlightMatch = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");

    return text.split(regex).map((part, i) =>
      part.match(regex) ? (
        <mark key={i} className={styles.highlight}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };


  // Markdown-style formatting for textarea
  const insertTag = (tagStart, tagEnd) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);

    const updatedText =
      content.slice(0, start) +
      tagStart +
      selected +
      tagEnd +
      content.slice(end);

    setContent(updatedText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagStart.length, end + tagStart.length);
    }, 0);
  };

  return (
    <div className={styles.container}>
      {/* Hide/Close button */}
      <img src={hideIcon} alt="Hide" onClick={onClose} className={styles.hide} />

      {/* Toast */}
      <div className={`${styles.toast} ${showSavedToast ? styles.visible : ""}`} role="status" aria-live="polite">
        Your note was saved!
      </div>

      {/* Toolbar */}
      <Toolbar
        onBold={() => insertTag("**", "**")}
        onItalic={() => insertTag("*", "*")}
        onUnderline={() => insertTag("__", "__")}
        onBullet={() => insertTag("- ", "")}
        onNumbered={() => insertTag("1. ", "")}
        onFont={() => alert("Font picker placeholder")}
        onSave={handleSave}
      />

      {/* Title */}
      <input
        placeholder="Title"
        className={styles.title}
        value={title}
        onChange={handleTitleChange}
      />

      {/* Date display */}
      <p className={styles.dateTime}>
        {note &&
          note.created?.toLocaleString("en-US", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
      </p>

      {/* Editor wrapper */}
      <div className={styles.editorWrapper}>
        {/* Highlight overlay */}
        <div className={styles.highlightedContent}>
          <pre>{highlightMatch(content)}</pre>
        </div>

        {/* Actual editable textarea */}
        <textarea
          ref={textareaRef}
          className={styles.noteArea}
          placeholder="What's on your mind..."
          value={content}
          onChange={handleContentChange}
        />
      </div>
    </div>
  );
}
