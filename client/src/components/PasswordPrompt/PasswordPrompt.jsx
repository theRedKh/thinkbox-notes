import styles from "./PasswordPrompt.module.css";
import { useState } from "react";

export default function PasswordPrompt({ title = "Password", message = "Enter password", onConfirm, onCancel }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!password || password.length === 0) {
      setError("Please enter a password");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onConfirm(password);
    } catch (err) {
      setError(err?.message || "Incorrect password");
      setLoading(false);
      return;
    }
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>

        <input
          type="password"
          className={styles.input}
          value={password}
          onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
          placeholder="Password..."
          autoFocus
          onKeyDown={(e) => { if (e.key === "Enter" && !loading) submit(); }}
        />

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel} disabled={loading}>Cancel</button>
          <button className={styles.confirm} onClick={submit} disabled={loading}>
            {loading ? "Working..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
