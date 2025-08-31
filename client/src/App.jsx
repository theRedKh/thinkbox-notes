import { useState } from 'react'
import './App.css'
import NoteForm from './components/NoteForm/NoteForm';
import Toolbar from './components/Toolbar/Toolbar';

function App() {
  

  return (
    <>
      <h1>Good Morning, User</h1>
      <Toolbar/>
      <NoteForm/>
    </>
  )
}

export default App
