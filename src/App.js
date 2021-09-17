import './App.css';
import Background from './Components/Background';
import ScoreBoards from './Components/ScoreBoards';
import InfoPannel from './Components/InfoPannel';
import GameInfoPannel from './Components/GameInfoPannel';
import Notification from './Components/Notification';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

function App() {
  const [player, setPlayer] = useState("")
  const [notification, setNotification] = useState()
  const [playerHeart, setPlayerHeart] = useState(3)
  const [opponent, setOpponent] = useState("")
  const [room, setRoom] = useState("");
  const [foundPartner, setFoundPartner] = useState(false);
  const [opponentHeart, setOpponentHeart] = useState(3)

  const [started, setStarted] = useState(false)
  const [socket, setSocket] = useState()
 
  useEffect(() => {
    if(player){
        setSocket(io("http://localhost:3001", { transports : ['websocket'] , query:  `name=${player}`}));
    }
  }, [player])

  useEffect(() => {
    if(socket){
      socket.on("opponentLeft", ()=>{
        setRoom()
        setNotification("Opponent Left!")
        setTimeout(() => {setNotification()}, 5000)
        setFoundPartner(false)
      })

      socket.on("readyToPlay", (roomObj)=>{
        console.log(roomObj);
        setFoundPartner(true)
      })
    }
  }, [socket])


  return (
      <>
        <Background/>
        {foundPartner? <GameInfoPannel
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
          setFoundPartner={setFoundPartner}
          />}
        {started && <ScoreBoards 
          player={player}
          opponent={opponent}
          playerHeart={playerHeart}
          opponentHeart={opponentHeart}
          />}
        {notification && <Notification
          notification={notification}
          />}
      </>
  );
}

export default App;
