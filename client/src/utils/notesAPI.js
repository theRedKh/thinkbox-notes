const BASE_URL = "http://localhost:5000/api/notes";

export async function getNotes() {
    const res = await fetch(BASE_URL);
    return res.json();
}

export async function addNote(note) {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
    });
    return res.json();
}

export async function updateNote(index, note) {
    const res = await fetch(`${BASE_URL}/${index}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
    });
    return res.json();
}

export async function deleteNote(index) {
    const res = await fetch(`${BASE_URL}/${index}`, { method: "DELETE" });
    return res.json();
}

