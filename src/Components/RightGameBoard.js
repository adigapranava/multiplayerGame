import React, { useEffect, useState } from 'react'
import styles from './CSS/GameRight.module.css'

function RightGameBoard({setPlayer, setOpponent,socket, started, room}) {
    const VEL = 0.7;
    var mySpace;
    var hisSpace;

    const [keysPressed, setKeysPressed] = useState({ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false})
    var dummyKeysPressed = {...keysPressed}
    var otherKeys
    const allowedKeyPress = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]

    const getWidthPersentage = (val)=>{
        return val / document.documentElement.clientWidth * 100
    }

    const getHeightPersentage = (val)=>{
        return val / document.documentElement.clientHeight * 100
    }

    const handelMySpaceShipMovement = () =>{
        // LEFT
        if (dummyKeysPressed["ArrowLeft"] && getWidthPersentage(mySpace.offsetLeft) - VEL > 51) {
            // console.log("l");
            mySpace.style.left = getWidthPersentage(mySpace.offsetLeft) - VEL +"%"
        }

        //RIGHT        
        if (dummyKeysPressed["ArrowRight"] && getWidthPersentage(mySpace.offsetLeft) + VEL + getWidthPersentage(mySpace.offsetWidth) < 100) {
            // console.log("r");
            mySpace.style.left = getWidthPersentage(mySpace.offsetLeft) + VEL +"%"
        }
        
        // UP
        if (dummyKeysPressed["ArrowUp"] && getHeightPersentage(mySpace.offsetTop) - VEL - getHeightPersentage(mySpace.offsetHeight / 2) > 0) {
            // console.log("u");
            mySpace.style.top = getHeightPersentage(mySpace.offsetTop) - VEL +"%"
        }
        
        // DOWN
        if(dummyKeysPressed["ArrowDown"] && getHeightPersentage(mySpace.offsetTop) + VEL + getHeightPersentage(mySpace.offsetHeight) - getHeightPersentage( mySpace.offsetHeight / 2)  < 100) {
            // console.log("d");
            mySpace.style.top = getHeightPersentage(mySpace.offsetTop) + VEL +"%"
        }
    }

    const handelOtherSpaceShipMovement = () =>{
        // LEFT
        if (otherKeys["ArrowLeft"] && getWidthPersentage(hisSpace.offsetLeft) - VEL > 0) {
            // console.log("l");
            hisSpace.style.left = getWidthPersentage(hisSpace.offsetLeft) - VEL +"%"
        }
        
        // RIGHT
        if (otherKeys["ArrowRight"] && getWidthPersentage(hisSpace.offsetLeft) + VEL + getWidthPersentage(hisSpace.offsetWidth) < 51) {
            // console.log("r");
            hisSpace.style.left = getWidthPersentage(hisSpace.offsetLeft) + VEL +"%"
        }
        
        // UP
        if (otherKeys["ArrowUp"] && getHeightPersentage(hisSpace.offsetTop) - VEL - getHeightPersentage(hisSpace.offsetHeight) / 2 > 0) {
            // console.log("u");
            hisSpace.style.top = getHeightPersentage(hisSpace.offsetTop) - VEL +"%"
        }
        
        // DOWN
        if(otherKeys["ArrowDown"] && getHeightPersentage(hisSpace.offsetTop) + VEL + getHeightPersentage(hisSpace.offsetHeight) - getHeightPersentage(hisSpace.offsetHeight) / 2  < 100) {
            // console.log("d");
            hisSpace.style.top = getHeightPersentage(hisSpace.offsetTop) + VEL +"%"
        }
    }

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
            handelMySpaceShipMovement()
            handelOtherSpaceShipMovement()            
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
            otherKeys = movedKeys
        })

        requestAnimationFrame(update)
    }, [])

    useEffect(() => {
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
