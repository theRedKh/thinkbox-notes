import styles from "./Toolbar.module.css";

export default function Toolbar({ onSave }){
    return(
        <div className={styles.container}>
            <button className={styles.btn}><b>B</b></button>
            <button className={styles.btn}><em>I</em></button>
            <button className={styles.btn}><u>U</u></button>
            <button className={styles.btn}>List Bullets</button>
            <button className={styles.btn}>List Numerical</button>
            <button className={styles.btn}>Font</button>
            {/* Save */}
            <button 
                className={styles.saveBtn}
                onClick={onSave}
            >
                Save
            </button>
        </div>
    );
}