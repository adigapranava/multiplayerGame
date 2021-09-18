import React from 'react'
import ScoreBoards from './ScoreBoards'
import LeftGameBoard from './LeftGameBoard'

function LeftSidePlayer({player, opponent, setPlayer, setOpponent,socket, started}) {
    return (
        <>
            <ScoreBoards 
                left={player.name}
                right={opponent.name}
                leftHeart={player.hearts}
                rightHeart={opponent.hearts}
                />
            <LeftGameBoard 
                setPlayer={setPlayer}
                setOpponent={setOpponent}
                socket={socket}
                started={started}
            />
        </>
    )
}

export default LeftSidePlayer
