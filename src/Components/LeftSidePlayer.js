import React from 'react'
import ScoreBoards from './ScoreBoards'
import hero1 from '../images/hero1.png'

function LeftSidePlayer({player, opponent}) {
    return (
        <>
            <ScoreBoards 
                left={player.name}
                right={opponent.name}
                leftHeart={player.hearts}
                rightHeart={opponent.hearts}
                />
            <img src={hero1} />
        </>
    )
}

export default LeftSidePlayer
