import { useState } from 'react'
import './App.css'
import NoteForm from './components/NoteForm/NoteForm';
import Toolbar from './components/Toolbar/Toolbar';
import NotesList from './components/NotesList/NotesList';
import Sidebar from './components/Sidebar/Sidebar';
function App() {
  

  return (
    <div className='app-container'>
      <Sidebar/>
      <NotesList/>
      <NoteForm/>
    </div>
  )
}

export default App
