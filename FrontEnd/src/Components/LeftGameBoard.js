import React, { useEffect, useState } from 'react'
import styles from './CSS/GameLeft.module.css'

function LeftGameBoard({player, opponent, setPlayer, setOpponent,socket, started, room}) {
    ////////////////////////////////////// VARIABLES ///////////////////////////
    var BOARD;
    const VEL = 1;
    const BULLETS_VEL = 1.25;
    const MAX_BULLETS = 3;
    
    //// PLAYERS VAR
    var mySpace;
    var myBullets = []
    const [keysPressed, setKeysPressed] = useState({ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false})
    var dummyKeysPressed = {...keysPressed}
    const [myHearts, setmyHearts] = useState(player.hearts)
    const [shoot, setShoot] = useState(false)
    var dummyShot = false;
    
    //// Other Players VAR
    var hisSpace;
    var hisBullets = []    
    var otherKeys
    const [hisHearts, setHisHearts] = useState(opponent.hearts)
    
    //To avoid buggy 1st Bullet Shot : variable that checks if any shoot by player
    const [anyShoots, setAnyShoots] = useState(false)
    
    // Arrow keys are allowed
    const allowedKeyPress = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]

    // TO handel FPS
    let lastTimestamp = 0,
    maxFPS = 60,
    timestep = 1000 / maxFPS;

    ////////////////////////////////////// FUNCTIONS ///////////////////////////
    
    // Utility Functions
    const getWidthPersentage = (val)=>{
        return val / document.documentElement.clientWidth * 100
    }

    const getHeightPersentage = (val)=>{
        return val / document.documentElement.clientHeight * 100
    }

    // Ship movement Handler
    const handelMySpaceShipMovement = () =>{
        // LEFT
        if (dummyKeysPressed["ArrowLeft"] && getWidthPersentage(mySpace.offsetLeft) - VEL > 0) {
            // console.log("l");
            mySpace.style.left = (getWidthPersentage(mySpace.offsetLeft) - VEL) + "%"
        }
        
        // RIGHT
        if (dummyKeysPressed["ArrowRight"] && getWidthPersentage(mySpace.offsetLeft) + VEL + getWidthPersentage(mySpace.offsetWidth) < 51) {
            // console.log("r");
            mySpace.style.left = (getWidthPersentage(mySpace.offsetLeft) + VEL) + "%"
        }
        
        // UP
        if (dummyKeysPressed["ArrowUp"] && getHeightPersentage(mySpace.offsetTop) - VEL > 0) {
            // console.log("u");
            mySpace.style.top = (getHeightPersentage(mySpace.offsetTop) - VEL) + "%"
        }
        
        // DOWN
        if(dummyKeysPressed["ArrowDown"] && getHeightPersentage(mySpace.offsetTop) + VEL + getHeightPersentage(mySpace.offsetHeight) < 100) {
            // console.log("d");
            mySpace.style.top = (getHeightPersentage(mySpace.offsetTop) + VEL) + "%"
        }
    }

    const handelOtherSpaceShipMovement = () =>{
        // LEFT
        if (otherKeys["ArrowLeft"] && getWidthPersentage(hisSpace.offsetLeft) - VEL > 51) {
            // console.log("l");
            hisSpace.style.left = (getWidthPersentage(hisSpace.offsetLeft) - VEL) + "%"
        }

        //RIGHT        
        if (otherKeys["ArrowRight"] && getWidthPersentage(hisSpace.offsetLeft) + VEL + getWidthPersentage(hisSpace.offsetWidth) < 100) {
            // console.log("r");
            hisSpace.style.left = (getWidthPersentage(hisSpace.offsetLeft) + VEL) + "%"
        }
        
        // UP
        if (otherKeys["ArrowUp"] && getHeightPersentage(hisSpace.offsetTop) - VEL > 0) {
            // console.log("u");
            hisSpace.style.top = (getHeightPersentage(hisSpace.offsetTop) - VEL) + "%"
        }
        
        // DOWN
        if(otherKeys["ArrowDown"] && getHeightPersentage(hisSpace.offsetTop) + VEL + getHeightPersentage(hisSpace.offsetHeight) < 100) {
            // console.log("d");
            hisSpace.style.top = (getHeightPersentage(hisSpace.offsetTop) + VEL) + "%"
        }
    }
    
    const handelMyBullets = () => {
         myBullets.forEach((bullet, index, object) => {
                // for all bullets which exited the screen remove from board and `myBullets`
                if(getWidthPersentage(bullet.offsetLeft) + BULLETS_VEL > 98){
                    BOARD.removeChild(bullet);
                    object.splice(index, 1);
                }else{
                    // if bullet hit the opponent then
                    //      reduce his heart
                    //      remove the bullet
                    if (didBulletHitHim(bullet)) {
                        setHisHearts(prevState => prevState - 1)
                        BOARD.removeChild(bullet);
                        object.splice(index, 1);
                    }else{
                        // else move the bullet
                        bullet.style.left = getWidthPersentage(bullet.offsetLeft) + BULLETS_VEL + "%";
                    }
                }
            });
    }
    
    const handelHisBullets = () => {
        hisBullets.forEach((bullet, index, object) => {
                // for all bullets which exited the screen remove from board and `hisBullets`
                if(getWidthPersentage(bullet.offsetLeft) < 0){
                    BOARD.removeChild(bullet);
                    object.splice(index, 1);
                }else{
                    // if bullet hit the player then
                    //      reduce players heart
                    //      remove the bullet
                    if(didBulletHitMe(bullet)){
                        setmyHearts(prevState => prevState - 1)
                        BOARD.removeChild(bullet);
                        object.splice(index, 1);
                    }else{
                        // else move the bullet
                        bullet.style.left = getWidthPersentage(bullet.offsetLeft) - BULLETS_VEL + "%";
                    }
                }
            });
    }
    
    // CREATE BULLET
    
    const createMyBullet = () =>{
        const bullet = document.createElement("div")
        bullet.setAttribute("class", styles.myBullets)
        bullet.style.left = getWidthPersentage(mySpace.offsetLeft) + getWidthPersentage(mySpace.offsetWidth) - 2 + "%"
        bullet.style.top = getHeightPersentage(mySpace.offsetTop) + getHeightPersentage(mySpace.offsetHeight) / 2 - 2 + "%"
        return bullet;
    }

    const createHisBullet = () => {
        const bullet = document.createElement("div")
        bullet.setAttribute("class", styles.enemyBullets)
        bullet.style.left = getWidthPersentage(hisSpace.offsetLeft) - 2 + "%"
        bullet.style.top = getHeightPersentage(hisSpace.offsetTop) + getHeightPersentage(hisSpace.offsetHeight) / 2 - 2 + "%"
        return bullet;
    }
    
    // COLLISION CHECK

    const didBulletHitMe = (bullet)=>{
        if(getWidthPersentage(bullet.offsetLeft)  < getWidthPersentage(mySpace.offsetLeft) + getWidthPersentage(mySpace.offsetWidth) 
                && getWidthPersentage(bullet.offsetLeft) > getWidthPersentage(mySpace.offsetLeft) 
            && getHeightPersentage(bullet.offsetTop) > getHeightPersentage(mySpace.offsetTop) 
                && getHeightPersentage(bullet.offsetTop) + getHeightPersentage(bullet.offsetHeight) < getHeightPersentage(mySpace.offsetTop) + getHeightPersentage(mySpace.offsetHeight) ){
                return true;
            }else{
                return false;
            }
    }

    const didBulletHitHim = (bullet) =>{
        if( getWidthPersentage(bullet.offsetLeft) + getWidthPersentage(bullet.offsetWidth) > getWidthPersentage(hisSpace.offsetLeft) 
                && getWidthPersentage(bullet.offsetLeft) + getWidthPersentage(bullet.offsetWidth) < getWidthPersentage(hisSpace.offsetLeft) + getWidthPersentage(hisSpace.offsetWidth)
            && getHeightPersentage(bullet.offsetTop) > getHeightPersentage(hisSpace.offsetTop) 
                && getHeightPersentage(bullet.offsetTop) + getHeightPersentage(bullet.offsetHeight) < getHeightPersentage(hisSpace.offsetTop) + getHeightPersentage(hisSpace.offsetHeight)){
                return true;
        }else{
            return false;
        }
    }

    // On key press 
    const keyDown = (e) =>{
        // if key is in ALLOWED KEYS
        if(allowedKeyPress.includes(e.key)){
            if(dummyKeysPressed[e.key] === false){ // this avoids change of state simply even if state is true this avoids call to server whn state change occurs
                    dummyKeysPressed = {...keysPressed, [e.key]: true}
                    setKeysPressed(dummyKeysPressed)
            }
            // if SPACE is pressed  and key is released (to avoid continious shooting if SPACE BAR is pressed and not realeased &&  bullets in the screen < MAX_BULLETS
        }else if(e.code === "Space" && dummyShot === false && myBullets.length < MAX_BULLETS){
            dummyShot = true;
            setAnyShoots(true)
            setShoot(prevState => !prevState)
            var bullet = createMyBullet()
            myBullets.push(bullet)
            BOARD.appendChild(bullet)
        }
    }

    const keyUp = (e) =>{
        if(allowedKeyPress.includes(e.key)){
            dummyKeysPressed = {...keysPressed, [e.key]: false}
           setKeysPressed(dummyKeysPressed)
        }else if(e.code === "Space"){
            dummyShot = false
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////  ANIMATION RESPONSIBLE FUNCTION  ///////////////////////////////////////////////
    
    const update = (timestamp)=>{
        window.requestAnimationFrame(update);

        // skip if timestep ms hasn't passed since last frame
        if (timestamp - lastTimestamp < timestep) return;

        lastTimestamp = timestamp;

        if(started){           

            handelMySpaceShipMovement()
            handelOtherSpaceShipMovement()
            handelMyBullets()
            handelHisBullets()
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // whn all components are rendered 
    useEffect(() => {
        otherKeys = {ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false}

        // grab myspace hisspace and board
        mySpace = document.getElementById(styles.mySpaceShip)
        hisSpace = document.getElementById(styles.enemySpaceShip)
        BOARD = document.getElementById("board")
        
        // add key down up listener
        document.addEventListener("keydown", keyDown)
        document.addEventListener("keyup", keyUp)

        // lister for the other players movement
        socket.on("heMoved", (movedKeys) => {
            otherKeys = movedKeys
        })
        
        // listen for other players shoot
        socket.on("heShot",()=>{
            // console.log("SSSS");
            var bullet = createHisBullet()
            hisBullets.push(bullet)
            BOARD.appendChild(bullet)
        })
        
        // call animation function
        requestAnimationFrame(update)
    }, [])
    
    // any change in KeysPressed state send to server
    useEffect(() => {
        socket.emit("iMoved", keysPressed, room);
    }, [keysPressed])
    
    // if shoot? then send to server
    useEffect(() => {
        if(anyShoots)
            socket.emit("iShot", room)
    }, [shoot])

    useEffect(() => {
        setOpponent({...opponent, hearts: hisHearts})
        setPlayer({...player, hearts: myHearts})
    }, [myHearts, hisHearts])


    return (
        <div className={styles.gameBoard} id="board">
            <div id={styles.mySpaceShip} />
            <div id={styles.enemySpaceShip} />
        </div>
    )
}

export default LeftGameBoard
