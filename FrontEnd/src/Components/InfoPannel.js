import React, { useEffect, useState } from 'react'
// import Fade from 'react-reveal/Fade';


export default function InfoPannel({ player, setPlayer, socket ,room, setRoom }) {
    const [name, setName] = useState(player.name);
    const [error, setError] = useState();
    const [roomText, setRoomText] = useState("");
    const [createRoom, setCreateRoom] = useState(false);
    const [joinRoom, setJoinRoom] = useState(false);
    
    ////////// FORM HANDLER /////////
    
    ////// set player name /////////
    const handelForm = (e) => {
        e.preventDefault();
        setPlayer({ ...player,  name: name})
    }

    ////// on Submitting Room Number make a call to server and get the status
    const handelForm2 = (e) => {
        setError("")
        e.preventDefault();
        
        // TODO : Make AJAX call instead
        socket.emit("tryToJoin", roomText);
        socket.on("resultJoiningRoom", (data)=>{
            if(!data.status){
                setError(data.text)
            }else{
                setRoom(roomText)
            }
        })
    }

    // on CREATE ROOM state change ask for random room id from server
    useEffect(() => {
        if(createRoom){
            
            // TODO : Make AJAX call instead
            socket.emit("getRoomId");
            socket.on('sendRoomId', (data)=>{
                setRoom(data)
            })
        }
    }, [createRoom])

    return (
            <div className="info-pannel">
                    <h2 style={{letterSpacing : "1px", padding: "8px 0px"}}>Hola!!👋🏻</h2>
                    <hr />
                    {player.name ? 
                        createRoom ?
                         // If Player name is set(ie socket is set) and room is CREATE ROOM is set then show the ROOM ID
                            (
                                <div className="players-name">
                                    Your Room Id is &nbsp; <br/>
                                    <strong style={{color: "#dda7ff"}}>{room}</strong>
                                    <br/>
                                    <span style={{fontSize: "15px"}}>Share this code to your friend</span>
                                    <p>Waiting for opponent To join...</p>
                                    <button onClick={()=>{socket.emit("exitRoom"); setRoom(); setJoinRoom(false); setCreateRoom(false)}}>Leave</button>
                                </div>   
                            ):
                            joinRoom ?
                             // If Player name is set(ie socket is set) and room is JOIN ROOM is set then show the form to fill the ROOM ID
                                (
                                    <form className="players-name" onSubmit={handelForm2}>
                                        Enter The Room ID
                                        <br />
                                            
                                            // Input Form
                                        <input type="text" name="name" id="name" autoComplete="off" 
                                            autoFocus="true"
                                            pattern="[0-9]{6}"
                                            title="Room ID must be 6 digit number"
                                            value={roomText} onChange={(e)=>setRoomText(e.target.value)}/>
                                        <br />
                                                
                                                //buttons
                                        // If any error then show the error
                                        {error && <strong style={{color :"#dd3300", fontSize: "15px"}}>{error}</strong>}
                                        <br />
                                        <button type="submit">Submit</button>

                                        // on go back  room is disabled
                                        <button onClick={()=>{setRoom(); setJoinRoom(false); setCreateRoom(false); setRoomText(); setError("")}}
                                                style={{backgroundColor :"#80818a"}}>Go Back</button>
                                    </form>
                                ):
                                
                                // if Only Player name is set then ask them to join or create room
                                (<div className="players-name">
                                    {name}, Ready To Play?
                                    <br />
                                    <button onClick={() => setCreateRoom(true)}>Create Room!</button>
                                    <button onClick={() => setJoinRoom(true)}>Join Room!</button>
                                </div>)
                    :
                    // if Player name is not set then show the form to fill the name
                    <form className="players-name" onSubmit={handelForm} >
                            Enter Your name
                            <br />
                            <input type="text" name="name" id="name" autoComplete="off" autoFocus="true"
                                pattern="[A-Za-z ]{4,}"
                                title="Name should contain atleast 4 alphabets"
                                value={name} onChange={(e)=>setName(e.target.value)}/>
                            <br />
                            <button type="submit">Submit</button>
                    </form>
                    }
            </div>
    )
}
