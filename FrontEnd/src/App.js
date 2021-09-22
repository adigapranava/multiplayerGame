import './App.css';
import Background from './Components/Background';
import BeforeStart from './Components/BeforeStart';
import GameScreen from './Components/GameScreen';
import Notification from './Components/Notification';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

function App() {
  ////////////////////////////////////////  CONSTANTS   ////////////////////////////////////////////////////////
  
  const [playerPosition, setPlayerPosition] = useState(true)
  // True => Left || False => Right
  
  const [player, setPlayer] = useState({name: "",hearts: 5})
  const [opponent, setOpponent] = useState({name: "",hearts: 5})

  const [notification, setNotification] = useState([])
  const [room, setRoom] = useState("");

  const [started, setStarted] = useState(false)
  const [socket, setSocket] = useState()
  
  
  
  ////////////////////////////////////////// USE EFFECTS //////////////////////////////////////////////////////////
  
  // ON CHANGE OF PLAYER OBJECT  RUN THIS
  useEffect(() => {
    // whn player name is ready then connect to socket pass the PLAYERS NAME
    if(player.name && !socket){
        setSocket(io(window.location.origin, { transports : ['websocket'] , query:  `name=${player.name}`}));
    }
    
    // When player heart becomes 0 then he lost
    if (player.hearts == 0) {
      initGame();
      addNotification("You lost")
    }
  }, [player])
  
  //  ON CHANGE OF OPPONENT OBJECT  RUN THIS 
  
  useEffect(() => {
    // when opponents heart become 0 he won
    if(opponent.hearts == 0){
      addNotification("You Won")
      initGame();
    }
  }, [opponent])
  
//    when socket is ready listen for
//            1) other player is ready to play
//            2) got start signal from Server (both players get at the same time)
//            3) opponent left
  
  useEffect(() => {
    if(socket){
      socket.on("opponentLeft", ()=>{
        initGame();
        addNotification("Opponent Left :(")
      })

      // set the opponent name and position alloted by server either LEFT OR RIGHT
      socket.on("readyToPlay", (roomObj)=>{
        setOpponent({...opponent, name: roomObj.opponent})
        setPlayerPosition(roomObj.yourPosition)
      })
      
      socket.on("startToPlay", ()=>{
        setStarted(true);
      })
    }
  }, [socket])

  
  
  
  //////////////////////////////////////////  Functions ///////////////////////////////////////////////////////

  const initGame = () =>{
    // socket && socket.emit("exitRoom", room)
    setRoom()
    setStarted()
    setPlayerPosition(true)
    setOpponent({name:"", hearts: 5})
    setPlayer({...player, hearts: 5})
  }

  const addNotification = (notificationText) =>{
      // add the notification to the notificationList
      setNotification([...notification,  notificationText])

      // after 5s remove it
      setTimeout(() => {
        setNotification(notification.filter(noti=>{
          return noti !== notificationText;
        }))
      }, 5000)
  }

  return (
      <>
        <Background/>

        {/* if game STARTED then show GameScreen else Before Start Screen*/}
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
