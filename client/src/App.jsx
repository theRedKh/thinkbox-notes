import { useState, useEffect } from 'react';
import './App.css';
import NoteForm from './components/NoteForm/NoteForm';
import NotesList from './components/NotesList/NotesList';
import Sidebar from './components/Sidebar/Sidebar';
import { getNotes, addNote, updateNote, deleteNote } from "./utils/notesAPI";

function App() {
  const [notes, setNotes] = useState([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 

  // Fetch notes on mount
  useEffect(() => {
    async function fetchNotes() {
      try{
        const data = await getNotes();
        setNotes(data);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      }
    }
    fetchNotes();
  }, []); // ✅ empty dependency array to run only once

  // 🟢 Add a new note
  const handleAddNote = async () => {
    const newNote = { 
      title: "Untitled Note", 
      content: "", 
      locked: false, 
      created: new Date() 
    };
    try {
      const savedNote = await addNote(newNote);
      setNotes((prev) => [savedNote, ...prev]);
      setCurrentNoteIndex(0); //open new note
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  };

  // 🟡 Update a note
  const handleUpdateNote = async (id, updatedFields) => {
    const updatedNote = await updateNote(id, updatedFields);
    setNotes((prev) => 
      prev.map((n) => (n.id === id ? updateNote : n)));
  };

  // 🔴 Delete a note
  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
      // collapse NoteForm if currently open note is deleted
      if (currentNoteIndex !== null && notes[currentNoteIndex].id === id) {
        setCurrentNoteIndex(null);
      }
    } catch (err) {
      console.error("Failed to delete note:",err);
    }
  };

  const handleToggleLock = async (id, currentLocked) => {
    try {
      const updatedNote = await updateNote(id, { locked: !currentLocked });
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? updatedNote : note))
      );
    } catch (err) {
      console.error("Failed to toggle lock:", err);
    }
  };

  return (
    <div className='app-container' style={{ display: 'flex' }}>
      <Sidebar />

      <NotesList
        notes={notes}
        setNotes={setNotes}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onEdit={(index) => setCurrentNoteIndex(index)}
        onDelete={handleDeleteNote}
        onAdd={handleAddNote}
        onToggleLock={handleToggleLock}
      />

      {currentNoteIndex !== null ? (
        <NoteForm
          note={notes[currentNoteIndex]}
          searchQuery={searchQuery}
          onUpdate={handleUpdateNote}
          onClose={() => setCurrentNoteIndex(null)}
        />
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", height: "95dvh" }}>
          <p style={{ opacity: 0.6 }}>Click <strong>+ New Note</strong> or edit an existing one</p>
        </div>
      )}
    </div>
  );
}

export default App;
