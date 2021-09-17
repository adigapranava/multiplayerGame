import React from 'react'
import styles from './CSS/Background.module.css';

export default function Background() {

    return (
        <div className={styles.backgroundImg}>
            <div className={styles.stars}></div>
            <div className={styles.clouds}></div>
        </div>
    )
}
