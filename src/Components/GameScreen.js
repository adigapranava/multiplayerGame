import React from 'react'
import ScoreBoards from './ScoreBoards'

function GameScreen({player, opponent}) {
    return (
        <>
            <ScoreBoards 
                player={player.name}
                opponent={opponent.name}
                playerHeart={player.hearts}
                opponentHeart={opponent.hearts}
                />
        </>
    )
}

export default GameScreen
