import './App.css';
import Background from './Components/Background';
import BeforeStart from './Components/BeforeStart';
import GameScreen from './Components/GameScreen';
import Notification from './Components/Notification';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

function App() {
  // True => Left || False => Right
  const [playerPosition, setPlayerPosition] = useState(true)
  const [player, setPlayer] = useState({name: "",hearts: 5})
  const [opponent, setOpponent] = useState({name: "",hearts: 5})

  const [notification, setNotification] = useState([])
  const [room, setRoom] = useState("");

  const [started, setStarted] = useState(false)
  const [socket, setSocket] = useState()
 
  // whn player name is ready then connect to socket
  useEffect(() => {
    if(player.name && !socket){
        setSocket(io(window.location.origin, { transports : ['websocket'] , query:  `name=${player.name}`}));
    }
    // console.log("player.hearts", player.hearts);
    if (player.hearts == 0) {
      initGame();
      addNotification("You lost")
    }
  }, [player])

  useEffect(() => {
    // console.log("opponent.hearts", opponent);
    if(opponent.hearts == 0){
      addNotification("You Won")
      initGame();
    }
  }, [opponent])

  useEffect(() => {
    if(socket){
      socket.on("opponentLeft", ()=>{
        initGame();
        addNotification("Opponent Left :(")
      })

      socket.on("readyToPlay", (roomObj)=>{
        setOpponent({...opponent, name: roomObj.opponent})
        setPlayerPosition(roomObj.yourPosition)
      })

      socket.on("startToPlay", ()=>{
        setStarted(true);
      })
    }
  }, [socket])


  const initGame = () =>{
    // socket && socket.emit("exitRoom", room)
    setRoom()
    setStarted()
    setPlayerPosition(true)
    setOpponent({name:"", hearts: 5})
    setPlayer({...player, hearts: 5})
  }

  const addNotification = (notificationText) =>{
      setNotification([...notification,  notificationText])

      setTimeout(() => {
        setNotification(notification.filter(noti=>{
          return noti !== notificationText;
        }))
      }, 5000)
  }

  return (
      <>
        <Background/>

        {/* if GAME STARTED then show GameSceen else Before Start Screen*/}
        {started ?
          <GameScreen 
            playerPosition={playerPosition}
            player={player}
            opponent={opponent}
            setPlayer={setPlayer}
            setOpponent={setOpponent}
            socket={socket}
            started={started}
            room={room}
            initGame={initGame}
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
        {notification.length > 0 && <Notification
          notification={notification}
          />}
      </>
  );
}

export default App;
