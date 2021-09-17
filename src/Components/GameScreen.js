import React from 'react'
import LeftSidePlayer from './LeftSidePlayer'
import RightSidePlayer from './RightSidePlayer'

function GameScreen({playerPosition, player, opponent}) {
    return (
        <>
        {playerPosition?
            <LeftSidePlayer 
                player={player}
                opponent={opponent}
            />
            :
            <RightSidePlayer
                player={player}
                opponent={opponent}
            />
                }
        </>
    )
}

export default GameScreen
