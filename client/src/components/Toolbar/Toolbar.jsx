import styles from "./Toolbar.module.css";
import listB from "../../assets/bullet_list.svg";
import listN from "../../assets/numbered_list.svg";
export default function Toolbar({ onBold, onItalic, onUnderline, onBulletn, onNumbered, onFont, onSave }) {
    return (
        <div className={styles.container}>
            <button className={styles.btn} onClick={onBold}><b>B</b></button>
            <button className={styles.btn} onClick={onItalic}><em>I</em></button>
            <button className={styles.btn} onClick={onUnderline}><u>U</u></button>
            <button className={styles.btn} onClick={onBulletn}><img src={listB}/></button>
            <button className={styles.btn} onClick={onNumbered}><img src={listN}/></button>
            {/*<button className={styles.btn} onClick={onFont}>Font</button>*/}
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