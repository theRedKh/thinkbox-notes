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
      const data = await getNotes();
      setNotes(data);
    }
    fetchNotes();
  }, []); // ✅ empty dependency array to run only once

  // 🟢 Add a new note
  const handleAddNote = async () => {
    const newNote = { title: "Untitled Note", content: "", locked: false, created: new Date() };
    const savedNote = await addNote(newNote);
    setNotes(prev => [savedNote, ...prev]);
    setCurrentNoteIndex(0); // open the new note immediately
  };

  // 🟡 Update a note
  const handleUpdateNote = async (id, updatedNote) => {
    const savedNote = await updateNote(id, updatedNote);
    setNotes(prev => prev.map((n) => (n._id === id ? savedNote : n)));
  };

  // 🔴 Delete a note
  const handleDeleteNote = async (id) => {
    await deleteNote(id);
    setNotes(prev => prev.filter(n => n._id !== id));
    // collapse NoteForm if currently open note is deleted
    if (currentNoteIndex !== null && notes[currentNoteIndex]._id === id) {
      setCurrentNoteIndex(null);
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
      />

      {currentNoteIndex !== null ? (
        <NoteForm
          note={notes[currentNoteIndex]}
          setNotes={setNotes}
          noteIndex={currentNoteIndex}
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
