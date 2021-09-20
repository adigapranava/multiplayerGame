import React from 'react'
import InfoPannel from './InfoPannel'
import GameInfoPannel from './GameInfoPannel'

function BeforeStart({socket, room, player, setRoom, setOpponent, opponent, setPlayer}) {
    return (
        <>
        {opponent.name? <GameInfoPannel
            socket={socket}
            room={room}
            player={player}
            />:
        <InfoPannel 
          player={player}
          setPlayer={setPlayer}
          socket ={socket}
          room = {room}
          setRoom = {setRoom}
          />}
        </>
    )
}

export default BeforeStart
