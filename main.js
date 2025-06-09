import { generateSalt, getKeyFromPassphrase, encryptData, decryptText } from './encryption.js';

const titleInput = document.getElementById("note-title");
const contentInput = document.getElementById("note-content");
const saveBtn = document.getElementById("save-note");
const notesContainer = document.getElementById("notes-container");
const passInput = document.getElementById("note-passphrase");
const lockBtn = document.getElementById("lock-note");

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    console.log("Loaded notes:", notes);

    notesContainer.innerHTML = "";

    notes.forEach((note, index) => {
        const noteEl = document.createElement("div");
        noteEl.classList.add('note');

        const previewText = note.encrypted ? "(Encrypted)" : note.content;

        noteEl.innerHTML = `
            <div class="note-header">
                <h3 class="note-title" title="View Note" onclick="viewNote(${index})">${note.title}</h3>
                <button title="Edit" onclick="editNote(${index})">Edit</button>
                <button title="Delete" onclick="deleteNote(${index})">Delete</button>
            </div>
            <p>${previewText}</p>
        `;

        notesContainer.appendChild(noteEl);
    });
}

function saveNote() {
    const notes = JSON.parse(localStorage.getItem('notes')) || []; // Load existing notes
    if (titleInput.value === "" || contentInput.value === "") {
        alert("Please enter a title for the note."); // Alert if title is empty
        return;
    } else if (notes.some(note => note.title === titleInput.value)) {
        alert("Note with this title already exists."); // Alert if note with same title exists
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

async function loadEncryptedNote(noteId, passphrase) {
    const saved = JSON.parse(localStorage.getItem(noteId)); // Load the encrypted note from local storage
    if (!saved) return null;

    const salt = new Uint8Array(saved.salt); // Convert saved salt back to Uint8Array
    const iv = new Uint8Array(saved.iv); // Convert saved IV back to Uint8Array
    const data = new Uint8Array(saved.data); // Convert saved data back to Uint8Array
    const key = await getKeyFromPassphrase(passphrase, salt); // Get the encryption key from the passphrase and salt
    const decrypted = await decryptText({ iv, data }, key); // Decrypt the note text
    return decrypted; // Return the decrypted note text

}

async function saveEncryptedNote(noteId, noteText, passphrase) {
    const salt = generateSalt(); // Generate a new salt
    const key = await getKeyFromPassphrase(passphrase, salt); // Get the encryption key from the passphrase and salt
    const encryptedNote = await encryptData(noteText, key); // Encrypt the note text
    const payload = {
        salt: Array.from(salt), // Convert salt to array for storage
        iv: encryptedNote.iv, // Store the IV
        data: encryptedNote.data // Store the encrypted data
    };
    localStorage.setItem(noteId, JSON.stringify(payload)); // Save the encrypted note to local storage
}

async function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || []; // Load existing notes
    const note = notes[index];

    if (note.encrypted) {
        const passphrase = passInput.value.trim();
        if (!passphrase) {
            alert("Please enter the passphrase in the passphrase field to delete this encrypted note.");
            return;
        }
        try {
            const salt = new Uint8Array(note.encrypted.salt);
            const key = await getKeyFromPassphrase(passphrase, salt);
            // Try decrypting just to verify passphrase
            await decryptText(
                { iv: note.encrypted.iv, data: note.encrypted.data },
                key
            );
            // If no error, delete the note
            notes.splice(index, 1);
            localStorage.setItem('notes', JSON.stringify(notes));
            loadNotes();
            passInput.value = ""; // clear passphrase
        } catch (e) {
            alert("Incorrect passphrase. Unable to delete note.");
        }
    } else {
        // unencrypted note - delete directly
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
    }
}

async function editNote(index){
    const notes = JSON.parse(localStorage.getItem('notes')) || []; // Load existing notes
    const note = notes[index]; // Get the note at the specified index
    if (note.encrypted) {
        const passphrase = passInput.value.trim(); // Get the passphrase from the input
        if (!passphrase) {
            alert("Please enter a passphrase in the passphrase field to edit this encrypted note.");
            return;
        }
        try {
            const salt = new Uint8Array(note.encrypted.salt); // Convert saved salt back to Uint8Array
            const key = await getKeyFromPassphrase(passphrase, salt); // Get the encryption key from the passphrase and salt
            const decrypted = await decryptText(
                { iv: note.encrypted.iv, data: note.encrypted.data },
                key // Decrypt the note text
            );
            titleInput.value = notes[index].title; // Set the title input to the note's title
            contentInput.value = decrypted; // Set the content input to the decrypted note content
            deleteNote(index);
            passInput.value = ""; // Clear the passphrase input 
        } catch (e) {
            alert("Failed to decrypt note. Please check your passphrase.");
        } 
        } else {
            //unencrypted note, edit normally
            titleInput.value = note.title; // Set the title input to the note's title
            contentInput.value = note.content; // Set the content input to the note's content
            deleteNote(index); // Delete the note from local storage
        }
    // This allows the user to edit the note and save it as a new one
    // without having to manually delete the old note.
    
}

function searchNotes() {
    const searchInput = document.getElementById("search").value.toLowerCase(); // Get the search input
    const notes = JSON.parse(localStorage.getItem('notes')) || []; // Load existing notes to array
    notesContainer.innerHTML = ""; // Clear the notes container to display filtered notes
    notes.forEach((note, originalIndex) => {
        if (note.title.toLowerCase().includes(searchInput) || 
        note.content.toLowerCase().includes(searchInput)) {

            const noteEl = document.createElement("div");
            noteEl.classList.add('note');
            noteEl.innerHTML = `
                <div class="note-header">
                    <h3 class="note-title" title="View Note" onclick="viewNote(${originalIndex})">${note.title}</h3>
                    <button title="Edit" onclick="editNote(${originalIndex})">Edit</button>
                    <button title="Delete" onclick="deleteNote(${originalIndex})">Delete</button>
                </div>
                <p>${note.content}</p>
            `;
            notesContainer.appendChild(noteEl); // Append each filtered note to the container
        }
    });
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

async function lockAndSaveNote() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const passphrase = passInput.value.trim();

    if (!title || !content) {
        alert("Please enter both a title and content.");
        return;
    }

    if (!passphrase) {
        alert("Please enter a passphrase to lock your note.");
        return;
    }

    if (notes.some(note => note.title === title)) {
        alert("A note with this title already exists.");
        return;
    }
    console.log("Notes before adding:", notes);
    

    const salt = generateSalt();
    const key = await getKeyFromPassphrase(passphrase, salt);
    const encrypted = await encryptData(content, key);

    const newNote = {
        title,
        encrypted: {
            salt: Array.from(salt),
            iv: encrypted.iv,
            data: encrypted.data
        }
    };
    console.log("New note:", newNote);
    notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));

    // Clear fields
    titleInput.value = "";
    contentInput.value = "";
    passInput.value = "";

    loadNotes();
}


lockBtn.addEventListener("click", lockAndSaveNote);
saveBtn.addEventListener("click", saveNote); // Add event listener to the save button
window.addEventListener("DOMContentLoaded", loadNotes); // Load notes when the page is loaded
document.getElementById("search").addEventListener("input", searchNotes); // Add event listener to the search input
window.editNote = editNote; // Expose editNote function to global scope
window.deleteNote = deleteNote; // Expose deleteNote function to global scope
window.viewNote = viewNote; // Expose viewNote function to global scope