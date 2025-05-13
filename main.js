const titleInput = document.getElementById("note-title");
const contentInput = document.getElementById("note-content");
const saveBtn = document.getElementById("save-note");
const notesContainer = document.getElementById("notes-container");

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || []; // Load notes from local storage
    notesContainer.innerHTML = ""; // Clear the container
    notes.forEach((note, index) => {
        const noteEl = document.createElement("div");
        noteEl.classList.add('note');
        // Add delete button
        noteEl.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button onclick="deleteNote(${index})">Delete</button> 
        `;
        notesContainer.appendChild(noteEl); // Append each note to the container
    });
}

function saveNote() {
    const notes = JSON.parse(localStorage.getItem('notes')) || []; // Load existing notes
    if (titleInput.value === "" || contentInput.value === "") {
        alert("Please enter a title for the note."); // Alert if title is empty
        return;
    }
    const newNote = {
        title: titleInput.value,
        content: contentInput.value
    };
    notes.push(newNote); // Add new note to the array
    localStorage.setItem('notes', JSON.stringify(notes)); // Save notes to local storage
    titleInput.value = ""; // Clear the input fields
    contentInput.value = "";
    loadNotes(); // Reload notes to display the new one
}

function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || []; // Load existing notes
    notes.splice(index, 1) // Remove the note at the specified index
    localStorage.setItem('notes', JSON.stringify(notes)); // Save updated notes to local storage
    loadNotes(); // Reload notes to reflect the deletion
}

saveBtn.addEventListener("click", saveNote); // Add event listener to the save button
window.addEventListener("DOMContentLoaded", loadNotes); // Load notes when the page is loaded

