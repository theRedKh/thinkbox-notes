import { useEffect, useState, useRef } from "react";
import { useState, useRef } from "react";
import styles from "./NoteForm.module.css";
import Toolbar from "../Toolbar/Toolbar";

export default function NoteForm({ note, setNotes, noteIndex, searchQuery }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);

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

      <div className={styles.editorWrapper}>
        {/* Highlighted overlay */}
        <div className={styles.highlightedContent}>
          <pre>{highlightMatch(content)}</pre>
        </div>

        {/* Actual textarea */}
        <textarea
          ref={textareaRef}
          className={styles.noteArea}
          placeholder="What's on your mind..."
          value={content}
          onChange={handleContentChange}
        />

        <Toolbar/>
      </div>
    </div>
  );

export default function NoteForm() {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const textareaRef = useRef(null);
  
  const handleSave = () => {
    if (noteIndex !== null) {
      setNotes(prev => {
        const copy = [...prev];
          copy[noteIndex] = { ...copy[noteIndex], title, content };
          return copy;
        });
        alert("Note saved!");
      }
    }

  const insertTag = (tagStart, tagEnd) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);
    const newText = content.slice(0, start) + tagStart + selected + tagEnd + content.slice(end);
    setContent(newText);

    // Restore selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagStart.length, end + tagStart.length);
    }, 0);
  };

  const handleBold = () => insertTag("**", "**");
  const handleItalic = () => insertTag("*", "*");
  const handleUnderline = () => insertTag("__", "__");
  const handleBullet = () => insertTag("- ", "");
  const handleNumbered = () => insertTag("1. ", "");
  const handleFont = () => alert("Font picker placeholder");

    return (
        <div className={styles.container}>
            <Toolbar
              onBold={handleBold}
              onItalic={handleItalic}
              onUnderline={handleUnderline}
              onFont={handleFont}
              onSave={handleSave}  
            />
            <input placeholder="Title" className={styles.title}/>
            <textarea className={styles.noteArea} placeholder="What's on your mind..."></textarea>
             
        </div>
    );
}
