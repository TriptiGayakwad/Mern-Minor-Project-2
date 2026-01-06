// On load, render notes from storage
document.addEventListener('DOMContentLoaded', displayNotes);

function getNotes() {
    // Retrieve from local storage 
    const notes = localStorage.getItem('notes');
    return notes ? JSON.parse(notes) : [];
}

function saveNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// 1. Create Note [cite: 13]
function addNote() {
    const input = document.getElementById('note-input');
    const errorMsg = document.getElementById('error-msg');
    const text = input.value.trim();

    // 5. Error Handling: Empty note warning [cite: 29]
    if (!text) {
        errorMsg.classList.remove('hidden');
        return;
    }
    
    errorMsg.classList.add('hidden');
    
    const notes = getNotes();
    const newNote = {
        id: Date.now(), // Unique ID for finding the note later
        content: text
    };
    
    notes.push(newNote);
    saveNotes(notes);
    input.value = ''; // Clear input
    displayNotes();   // Refresh UI
}

// 2. Display Notes [cite: 16]
function displayNotes() {
    const notesContainer = document.getElementById('notes-container');
    const notes = getNotes();
    
    notesContainer.innerHTML = ''; // Clear current list
    
    notes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');
        
        // 4. Edit Note & 3. Delete Note buttons [cite: 20, 24]
        noteCard.innerHTML = `
            <div class="note-content" id="content-${note.id}">${note.content}</div>
            <div class="note-actions">
                <button class="edit-btn" onclick="enableEdit(${note.id})">Edit</button>
                <button class="delete-btn" onclick="deleteNote(${note.id})">Delete</button>
            </div>
        `;
        
        notesContainer.appendChild(noteCard);
    });
}

// 3. Delete Note [cite: 20]
function deleteNote(id) {
    let notes = getNotes();
    // Remove note from storage 
    notes = notes.filter(note => note.id !== id);
    saveNotes(notes);
    // Remove note from UI 
    displayNotes();
}

// 4. Edit Note [cite: 24]
function enableEdit(id) {
    const contentDiv = document.getElementById(`content-${id}`);
    const currentText = contentDiv.innerText;
    
    // Replace text with a textarea for editing
    contentDiv.innerHTML = `
        <textarea class="edit-textarea" id="edit-input-${id}">${currentText}</textarea>
        <button onclick="saveEdit(${id})">Save</button>
        <button onclick="displayNotes()">Cancel</button>
    `;
}

function saveEdit(id) {
    const newText = document.getElementById(`edit-input-${id}`).value.trim();
    
    if (!newText) {
        alert("Note cannot be empty!"); // Simple validation for edit
        return;
    }

    let notes = getNotes();
    const noteIndex = notes.findIndex(note => note.id === id);
    
    if (noteIndex > -1) {
        notes[noteIndex].content = newText; // Update saved note [cite: 27]
        saveNotes(notes);
        displayNotes();
    }
}