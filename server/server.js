const express = require("express"); //import express
const cors = require("cors"); //import cors to allow cross-origin requests
const fs = require("fs"); //import fs to read/write files
const path = require("path"); //import path to handle file paths

const app = express(); //create express app
const PORT = 5000; //server port

//Middleware
app.use(cors()); //allow requests from the react app
app.use(express.json()); //parse json bodies

//path to the notes file
const notesFile = path.join(__dirname, "notes.json"); 

//Helper functions to read and write notes
//read json file and convert to array
const readNotes = () => {
    try {
        const data = fs.readFileSync(notesFile, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.log("No notes file found, starting with empty array");
        return [];
    }
};

//write notes to JSON - convert array to json and save
const writeNotes = (notes) => {
    fs.writeFileSync(notesFile, JSON.stringify(notes, null, 2), "utf-8");
}

//API endpoints

//GET all notes
app.get("/api/notes", (req, res) => {
    const notes = readNotes();
    res.json(notes);
});

//POST a new note
app.post("/api/notes", (req, res) => {
    const notes = readNotes();
    const newNote = req.body; //sent from front end
    notes.push(newNote);
    writeNotes(notes);
    res.status(201).json(newNote);
});

//PUT update a note by index
app.put("/api/notes/:index", (req, res) => {
    const notes = readNotes();
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < notes.length) {
        notes[index] = req.body; //updated note from front end
        writeNotes(notes);
        res.json(notes[index]);
    } else {
        res.status(404).json({ error: "Note not found" });
    }
});

//DELETE a note by index
app.delete("/api/notes/:index", (req, res) => {
    const notes = readNotes();
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < notes.length) {
        const deletedNote = notes.splice(index, 1);
        writeNotes(notes);
        res.json(deletedNote[0]);
    } else {
        res.status(404).json({ error: "Note not found" });
    }
});


//Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

