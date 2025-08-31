import styles from "./Toolbar.module.css";

export default function Toolbar(){
    return(
        <div className={styles.container}>
            <button className={styles.btn}></button>
            <button className={styles.btn}></button>
            <button className={styles.btn}></button>
        </div>
    );
}