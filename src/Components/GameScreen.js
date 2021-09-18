import React from 'react'
import LeftSidePlayer from './LeftSidePlayer'
import RightSidePlayer from './RightSidePlayer'

function GameScreen({playerPosition, player, opponent, setPlayer, setOpponent,socket, started, room}) {
    return (
        <>
        {playerPosition?
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
        </>
    )
}

export default GameScreen
