import './App.css';
import Background from './Components/Background';
import BeforeStart from './Components/BeforeStart';
import GameScreen from './Components/GameScreen';
import Notification from './Components/Notification';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

function App() {
  // True => Left || False => Right
  const [postiton, setPosition] = useState(true);
  const [player, setPlayer] = useState({name: "",hearts: 3})
  const [opponent, setOpponent] = useState({name: "",hearts: 3})

  const [notification, setNotification] = useState()
  const [room, setRoom] = useState("");

  const [foundPartner, setFoundPartner] = useState(false);

  const [started, setStarted] = useState(false)
  const [socket, setSocket] = useState()
 
  // whn player name is ready then connect to socket
  useEffect(() => {
    if(player.name){
        setSocket(io("http://localhost:3001", { transports : ['websocket'] , query:  `name=${player.name}`}));
    }
  }, [player])

  useEffect(() => {
    if(socket){
      socket.on("opponentLeft", ()=>{
        setRoom()
        setStarted()
        setOpponent({...opponent, name:""})
        addNotification("Opponent Left :(")
      })

      socket.on("readyToPlay", (roomObj)=>{
        console.log(roomObj);
        setOpponent({...opponent, name: roomObj.opponent})
        setPosition(roomObj.yourPosition)
      })

      socket.on("startToPlay", ()=>{
        setStarted(true);
      })
    }
  }, [socket])


  const addNotification = (notificationText) =>{
      setNotification(notificationText)
      setTimeout(() => {setNotification()}, 5000)
  }


  return (
      <>
        <Background/>

        {/* if GAME STARTED then show GameSceen else Before Start Screen*/}
        {started ?
          <GameScreen 
            player={player}
            opponent={opponent}
          />:
          <BeforeStart 
            player={player}
            opponent={opponent}
            setPlayer={setPlayer}
            setOpponent={setOpponent}
            socket ={socket}
            room = {room}
            setRoom = {setRoom}
          />
         }

         {/* if any notification */}
        {notification && <Notification
          notification={notification}
          />}
      </>
  );
}

export default App;
