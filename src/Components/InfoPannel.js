import React, { useEffect, useState } from 'react'
// import Fade from 'react-reveal/Fade';


export default function InfoPannel({ player, setPlayer, socket ,room, setRoom }) {
    const [name, setName] = useState(player.name);
    const [error, setError] = useState();
    const [roomText, setRoomText] = useState("");
    const [createRoom, setCreateRoom] = useState(false);
    const [joinRoom, setJoinRoom] = useState(false);

    const handelForm = (e) => {
        e.preventDefault();
        setPlayer({ ...player,  name: name})
    }

    const handelForm2 = (e) => {
        setError("")
        e.preventDefault();
        socket.emit("tryToJoin", roomText);
        socket.on("resultJoiningRoom", (data)=>{
            if(!data.status){
                setError(data.text)
            }
        })
    }

    useEffect(() => {
        if(createRoom){
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
                                (
                                    <form className="players-name" onSubmit={handelForm2}>
                                        Enter The Room ID
                                        <br />
                                        <input type="text" name="name" id="name" autoComplete="off" 
                                            autoFocus="true"
                                            pattern="[0-9]{6}"
                                            title="Room ID must be 6 digit number"
                                            value={roomText} onChange={(e)=>setRoomText(e.target.value)}/>
                                        <br />
                                        {error && <strong style={{color :"#dd3300", fontSize: "15px"}}>{error}</strong>}
                                        <br />
                                        <button type="submit">Submit</button>
                                        <button onClick={()=>{setRoom(); setJoinRoom(false); setCreateRoom(false); setRoomText(); setError("")}}
                                                style={{backgroundColor :"#80818a"}}>Go Back</button>
                                    </form>
                                ):
                                (<div className="players-name">
                                    {name}, Ready To Play?
                                    <br />
                                    <button onClick={() => setCreateRoom(true)}>Create Room!</button>
                                    <button onClick={() => setJoinRoom(true)}>Join Room!</button>
                                </div>)
                    :
                    <form className="players-name" onSubmit={handelForm} >
                            Enter Your name
                            <br />
                            <input type="text" name="name" id="name" autoComplete="off" autoFocus="true"
                                pattern="[A-Za-z]{4,}"
                                title="Name should contain atleast 4 alphabets"
                                value={name} onChange={(e)=>setName(e.target.value)}/>
                            <br />
                            <button type="submit">Submit</button>
                    </form>
                    }
            </div>
    )
}
