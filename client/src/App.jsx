import { useState } from 'react'
import './App.css'
import NoteForm from './components/NoteForm/NoteForm';
import Toolbar from './components/Toolbar/Toolbar';
import NotesList from './components/NotesList/NotesList';
import Sidebar from './components/Sidebar/Sidebar';
function App() {
  const [notes, setNotes] = useState([
    { title: "First Note", content: "Content of first note", locked: false, created: new Date() },
    { title: "Shopping List", content: "Eggs, Milk, Bread", locked: true, created: new Date() },
    { title: "Ideas", content: "React app for students", locked: false, created: new Date() },
  ]);

  const [currentNoteIndex, setCurrentNoteIndex] = useState(null); // null = no note selected


  return (
    <div className='app-container' style={{ display: 'flex' }}>
      <Sidebar/>
      <NotesList
        notes={notes}
        setNotes={setNotes}
        onEdit={(index) => setCurrentNoteIndex(index)}
      />
      <NoteForm
        note={currentNoteIndex !== null ? notes[currentNoteIndex] : null}
        setNotes={setNotes}
        noteIndex={currentNoteIndex}
      />
    </div>
  )
}

export default App
