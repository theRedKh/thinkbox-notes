# NoteHaven 🌱
#### _Previously Thinkbox Notes_
NoteHaven is a lightweight, browser-based note-taking app built with React and Node. It saves your notes directly onto your device using `file storage`, keeping your thoughts private, offline and always available - no sign-ups, no syncing, no cloud.

This project is part of a hands-on journey into DevSecOps and web app security, showing how even a simple tool can be built thoughtfully with **security and privacy** in mind.

## ⚡Features
 - Add and delete notes instantly
 - Persistent storage using `local JSON files`
   - _earlier versions relied on browser localStorage; later migrated to file-based storage for better control and security_
 - Fully offline - works without internet
 - Simple, clean interface, customizable themes
   - (version 0.2.0 supports only the `sage` theme)
 - Password-Lock private notes with a powerful AES-256-GCM encryption algorithm


## 🛡️Security-Focused Goals (In Progress)
 - Input sanitization
 - Default Encryption on all your stored notes
 - Optional password protection for sensitive notes
 - LOCAL AI-assisted content tagging for extra privacy (future feature)
 - User login and authentication (future feature, for cloud sync & easy migration)

## 🎯 This project taught me:
 - JSON local storage
 - Setting up Node.js backend server
 - Introduction to Security for Web Development

## ☁️ Updates:
 - version 0.1.0: First working prototype, basic notes, minimal styling - Made only in HTML/CSS/JS
 - version 0.2.0: 
    - Second working prototype: 
        - Restyled interface
        - text notes with some styling (bold, italics, bullet pts etc)
        - categorize notes into folders
        - favorite notes
        - Sage themed buttons
        - **Successful ENCRYPTION, password based**

## 📦 How to run and use it
`This project is currently under development`

1. Clone the repo
2. Install Dependencies
3. Within the project in vs code:
```windows powershell
cd client
npm run dev

cd server
npm start
```
**The main frontend runs on localhost:5173**

### ☕Notes from the developer
I built NoteHaven with a user-first and security-first mindset.
My goal as a developer is to make users feel comfortable, informed, and in control of their data. In an age of cloud platforms and opaque AI systems, I believe transparency matters; that is, users should understand where their data lives, how it's stored, and how it's protected.

NoteHaven is intentionally offline, local, and minimal to remove uncertainty and external interference.
