import React from 'react'
import InfoPannel from './InfoPannel'
import GameInfoPannel from './GameInfoPannel'

function BeforeStart({socket, room, player, setRoom, setOpponent, opponent, setPlayer}) {
    return (
        <>
        // if opponent found and game not started then show the GAME WILL START SOON PAGE (ie <GameInfoPannel />)
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
