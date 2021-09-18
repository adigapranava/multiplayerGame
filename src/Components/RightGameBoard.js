import React, { useEffect, useState } from 'react'
import styles from './CSS/GameRight.module.css'

function RightGameBoard({setPlayer, setOpponent,socket, started, room}) {
    const VEL = 5;
    var mySpace;
    var hisSpace;

    const [keysPressed, setKeysPressed] = useState({ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false})
    var dummyKeysPressed = {...keysPressed}
    var otherKeys
    const allowedKeyPress = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]

   const keyDown = (e) =>{
       if(allowedKeyPress.includes(e.key)){
           if(dummyKeysPressed[e.key] === false){
                dummyKeysPressed = {...keysPressed, [e.key]: true}
                setKeysPressed(dummyKeysPressed)
           }
        }
   }

    const keyUp = (e) =>{
        if(allowedKeyPress.includes(e.key)){
            dummyKeysPressed = {...keysPressed, [e.key]: false}
           setKeysPressed(dummyKeysPressed)
        }
    }

    const update = ()=>{
        if(started){
            if (dummyKeysPressed["ArrowLeft"] && mySpace.offsetLeft-VEL > document.documentElement.clientWidth / 2 + 20) {
                // console.log("l");
                mySpace.style.left = mySpace.offsetLeft - VEL +"px"
            }if (dummyKeysPressed["ArrowRight"] && mySpace.offsetLeft + VEL + mySpace.offsetWidth < document.documentElement.clientWidth) {
                // console.log("r");
                mySpace.style.left = mySpace.offsetLeft + VEL +"px"
            }if (dummyKeysPressed["ArrowUp"] && mySpace.offsetTop - VEL - mySpace.offsetHeight / 2 > 0) {
                // console.log("u");
                mySpace.style.top = mySpace.offsetTop - VEL +"px"
            }if(dummyKeysPressed["ArrowDown"] && mySpace.offsetTop + VEL + mySpace.offsetHeight - mySpace.offsetHeight / 2  < document.documentElement.clientHeight) {
                // console.log("d");
                mySpace.style.top = mySpace.offsetTop + VEL +"px"
            }

            if (otherKeys["ArrowLeft"] && hisSpace.offsetLeft-VEL > 0) {
                // console.log("l");
                hisSpace.style.left = hisSpace.offsetLeft - VEL +"px"
            }if (otherKeys["ArrowRight"] && hisSpace.offsetLeft + VEL + hisSpace.offsetWidth < document.documentElement.clientWidth / 2 -20) {
                // console.log("r");
                hisSpace.style.left = hisSpace.offsetLeft + VEL +"px"
            }if (otherKeys["ArrowUp"] && hisSpace.offsetTop - VEL - hisSpace.offsetHeight / 2 > 0) {
                // console.log("u");
                hisSpace.style.top = hisSpace.offsetTop - VEL +"px"
            }if(otherKeys["ArrowDown"] && hisSpace.offsetTop + VEL + hisSpace.offsetHeight - hisSpace.offsetHeight / 2  < document.documentElement.clientHeight) {
                // console.log("d");
                hisSpace.style.top = hisSpace.offsetTop + VEL +"px"
            }
            requestAnimationFrame(update)
        }
    }

    useEffect(() => {
        otherKeys = {ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false}

        mySpace = document.getElementById(styles.mySpaceShip)
        hisSpace = document.getElementById(styles.enemySpaceShip)

        document.addEventListener("keydown", keyDown)
        document.addEventListener("keyup", keyUp)

        socket.on("heMoved", (movedKeys) => {
            console.log("hemoved");
            otherKeys = movedKeys
        })

        requestAnimationFrame(update)
    }, [])

    useEffect(() => {
        // console.log("UPDATED=>", keysPressed);
        // TODO EMIT TO SERVER
        // socket.emit("iMoved", keysPressed);
        socket.emit("iMoved", keysPressed, room);
    }, [keysPressed])


    return (
        <div className={styles.gameBoard}>
            <div id={styles.enemySpaceShip} />
            <div id={styles.mySpaceShip} />
        </div>
    )
}

export default RightGameBoard;
