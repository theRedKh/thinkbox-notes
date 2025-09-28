import { useEffect, useState, useRef } from "react";
import { useState, useRef } from "react";
import styles from "./NoteForm.module.css";
import Toolbar from "../Toolbar/Toolbar";
import hideIcon from "../../assets/hide_googlefonts.svg"; // Import SVG as URL

export default function NoteForm({ note, setNotes, noteIndex, searchQuery, onClose }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const editorRef = useRef(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      if (editorRef.current) {
        editorRef.current.innerHTML = note.content;
      }
    } else {
      setTitle("");
      setContent("");
      if (editorRef.current) editorRef.current.innerHTML = "";
    }
  }, [note]);

  const handleSave = () => {
    if (noteIndex !== null) {
      setNotes(prev => {
        const copy = [...prev];
        copy[noteIndex] = { ...copy[noteIndex], title, content };
        return copy;
      });
      alert("Note saved!");
    }
  };

  const handleFormat = (command) => {
    document.execCommand(command, false, null);
    setContent(editorRef.current.innerHTML);
  };

  const handleBulletList = () => {
    handleFormat("insertUnorderedList");
  };

  const handleNumberedList = () => {
    handleFormat("insertOrderedList");
  };

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

  const handleInput = () => {
    setContent(editorRef.current.innerHTML);
    if (noteIndex !== null) {
      setNotes((prev) => {
        const copy = [...prev];
        copy[noteIndex].content = editorRef.current.innerHTML;
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
      <img
        src={hideIcon}
        alt="Hide"
        style={{ cursor: "pointer", marginBottom: 8 }}
        onClick={onClose}
      />
      <Toolbar
        onBold={() => handleFormat("bold")}
        onItalic={() => handleFormat("italic")}
        onUnderline={() => handleFormat("underline")}
        onBulletn={handleBulletList}
        onNumbered={handleNumberedList}
        onFont={() => alert("Font picker placeholder")}
        onSave={handleSave}  
      />
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
      <div
        ref={editorRef}
        className={styles.noteArea}
        contentEditable={true}
        onInput={handleInput}
        suppressContentEditableWarning={true}
        placeholder="What's on your mind..."
      />
    </div>
  );
}
