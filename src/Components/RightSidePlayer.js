import React from 'react'
import ScoreBoards from './ScoreBoards'

function RightSidePlayer({player, opponent}) {
    return (
        <>
           <ScoreBoards 
                right={player.name}
                left={opponent.name}
                rightHeart={player.hearts}
                leftHeart={opponent.hearts}
                /> 
        </>
    )
}

export default RightSidePlayer
