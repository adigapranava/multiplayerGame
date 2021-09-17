import React from 'react'
import {HiHeart , HiOutlineHeart} from 'react-icons/hi'
import styles from './CSS/Scoreboard.module.css';

export default function ScoreBoards(props) {
    const getHearts = (count) =>{
        var temp = []
        for (let i = 1; i <= 3; i++) {
            if(i <= count){
                temp.push(<HiHeart style={{color: 'tomato'}}/>)
            }else{
                temp.push(<HiOutlineHeart style={{color: 'tomato'}}/>)
            }
        }
        return temp;
    }

    return (
        <div>
            <div className={styles.scoreBoard1} >
                <h3 className={styles.h3}>{props.player}</h3>
                <div className={styles.hearts}>
                    {getHearts(props.playerHeart)}
                </div>
            </div>
            <div className={styles.scoreBoard2} >
                <h3 className={styles.h3}>{props.opponent}</h3>
                <div className={styles.hearts}>
                    {getHearts(props.opponentHeart)}
                </div>
            </div>
        </div>
    )
}
