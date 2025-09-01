import { useState, useRef } from "react";
import styles from "./NoteForm.module.css";
import Toolbar from "../Toolbar/Toolbar";

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