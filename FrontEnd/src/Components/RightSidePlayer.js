import React from 'react'
import ScoreBoards from './ScoreBoards'
import RightGameBoard from './RightGameBoard'


function RightSidePlayer({player, opponent, setPlayer, setOpponent,socket, started, room}) {
    return (
        <>
           <ScoreBoards 
                right={player.name}
                left={opponent.name}
                rightHeart={player.hearts}
                leftHeart={opponent.hearts}
                /> 
            <RightGameBoard 
                player={player} 
                opponent={opponent}
                setPlayer={setPlayer}
                setOpponent={setOpponent}
                socket={socket}
                started={started}
                room={room}
            />
        </>
    )
}

export default RightSidePlayer
