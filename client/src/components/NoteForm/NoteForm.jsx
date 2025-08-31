import { useState, useEffect } from "react";
import styles from "./NoteForm.module.css";
import Toolbar from "../Toolbar/Toolbar";

export default function NoteForm() {
    const [dateTime, setDateTime] = useState("");

    useEffect(() => {
        const now= new Date();
        const day = now.getDate();
        const month = now.toLocaleString("en-US", { month: "long" });
        const year = now.getFullYear();
        const time = now.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

        const formatted = `${day} ${month}, ${year} at ${time}`;
        setDateTime(formatted);
    }, []);

    return (
        <div className={styles.container}>
            <input placeholder="Title" className={styles.title}/>
            <p className={styles.dateTime}>{dateTime}</p>
            <textarea className={styles.noteArea} placeholder="What's on your mind..."></textarea>
             <Toolbar/>
        </div>
    );
}