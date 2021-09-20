import React from 'react'
import styles from './CSS/Loding.module.css';

function GameInfoPannel(socket, room, player) {
    return (
        <div className="info-pannel">
            <div className="players-name">
                <p style={{color: "#3dffaa"}}>Found The Partner!!</p>
                <span style={{fontSize: "15px"}}>Game Will start soon...</span>
                <br />
                <br />
                <div className={styles.loader}>
                    <div className={styles.lineLeft}></div>
                    <div className={styles.ball}></div>
                    <div className={styles.lineRight}></div>
                </div>
            </div>   
        </div>
    )
}

export default GameInfoPannel
