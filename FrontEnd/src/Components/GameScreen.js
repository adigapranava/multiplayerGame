import React from 'react'
import LeftSidePlayer from './LeftSidePlayer'
import RightSidePlayer from './RightSidePlayer'

function GameScreen({playerPosition, player, opponent, setPlayer, setOpponent,socket, started, room, initGame}) {
    return (
        <>
        {playerPosition?
         // if Players position is LEFT then show <LeftSidePlayer>
            <LeftSidePlayer 
                player={player}
                opponent={opponent}
                setPlayer={setPlayer}
                setOpponent={setOpponent}
                socket={socket}
                started={started}
                room={room}
            />
            :
                // if Players position is LEFT then show <RightSidePlayer>
            <RightSidePlayer
                player={player}
                opponent={opponent}
                setPlayer={setPlayer}
                setOpponent={setOpponent}
                socket={socket}
                started={started}
                room={room}
            />
                }
            
                // exit Button 🏃🏻‍♂️
            <div className="exit" 
                onClick={()=>{socket.emit("exitRoom"); initGame()}}
                style={
                    {position: 'absolute', 
                    bottom: '8px', 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    backgroundColor: "tomato", 
                    padding: "0.5rem 1.5rem", 
                    color:"#ddd", 
                    borderRadius: "4px", 
                    cursor:"pointer"}}>
                EXIT 🏃🏻‍♂️
            </div>
        </>
    )
}

export default GameScreen
