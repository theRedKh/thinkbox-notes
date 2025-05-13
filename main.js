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
            <div class="note-header">
                <h3 class="note-title" title="View Note" onclick="viewNote(${index})">${note.title}</h3>
                <button title="Edit" onclick="editNote(${index})">Edit</button>
                <button title="Delete" onclick="deleteNote(${index})">Delete</button>
            </div>
            <p>${note.content}</p>
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

function editNote(index){
    const notes = JSON.parse(localStorage.getItem('notes')) || []; // Load existing notes
    titleInput.value = notes[index].title; // Set the title input to the note's title
    contentInput.value = notes[index].content; // Set the content input to the note's content
    deleteNote(index); // Delete the note after loading it into the input fields
    // This allows the user to edit the note and save it as a new one
    // without having to manually delete the old note.

}

//View note as a modal
function viewNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || []; // Load existing notes
    const note = notes[index]; // Get the note at the specified index
    const modal = document.getElementById("note-modal"); // Get the modal element
    const modalTitle = document.getElementById("modal-title"); // Get the modal title element
    const modalContent = document.getElementById("modal-content"); // Get the modal content element
   
    modal.style.display = "block"; // Show the modal
    modalTitle.innerText = note.title; // Set the modal title to the note's title
    modalContent.innerText = note.content; // Set the modal content to the note's content
    
    const closeBtn = document.getElementsByClassName("close")[0]; // Get the close button
    closeBtn.onclick = function() {
        modal.style.display = "none"; // Hide the modal when the close button is clicked
    }

    //Close modal when clicking outside
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

saveBtn.addEventListener("click", saveNote); // Add event listener to the save button
window.addEventListener("DOMContentLoaded", loadNotes); // Load notes when the page is loaded