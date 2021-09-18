import React from 'react'
import LeftSidePlayer from './LeftSidePlayer'
import RightSidePlayer from './RightSidePlayer'

function GameScreen({playerPosition, player, opponent, setPlayer, setOpponent,socket, started}) {
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
            />
            :
            <RightSidePlayer
                player={player}
                opponent={opponent}
                setPlayer={setPlayer}
                setOpponent={setOpponent}
                socket={socket}
                started={started}
            />
                }
        </>
    )
}

export default GameScreen
