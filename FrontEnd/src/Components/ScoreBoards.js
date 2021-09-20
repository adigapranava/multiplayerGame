import React from 'react'
import {HiHeart , HiOutlineHeart} from 'react-icons/hi'
import styles from './CSS/Scoreboard.module.css';

export default function ScoreBoards(props) {
    const getHearts = (count) =>{
        var temp = []
        for (let i = 1; i <= 5; i++) {
            if(i <= count){
                temp.push(<HiHeart style={{color: 'tomato'}} key={i}/>)
            }else{
                temp.push(<HiOutlineHeart style={{color: 'tomato'}} key={i}/>)
            }
        }
        return temp;
    }

    return (
        <div>
            <div className={styles.scoreBoard1} >
                <h3 className={styles.h3}>{props.left}</h3>
                <div className={styles.hearts}>
                    {getHearts(props.leftHeart)}
                </div>
            </div>
            <div className={styles.scoreBoard2} >
                <h3 className={styles.h3}>{props.right}</h3>
                <div className={styles.hearts}>
                    {getHearts(props.rightHeart)}
                </div>
            </div>
        </div>
    )
}
