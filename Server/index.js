const express = require('express')
const app = express()

const server = require('http').createServer(app)
const io = require('socket.io')(server, {cors: {origin: "*", methods: ["GET", "POST"]}})
const port = process.env.PORT || 3001

server.listen(port, ()=>{
    console.log(`Server is Online on port ${port}`);
})


// Curently Active Rooms
var activeRooms = []
var roomIdLength = 6

// create random room
const createRoom = () => {
    do {
        // generates random `roomIdLength` digit number
        min = Math.pow(10, roomIdLength-1)
        max = Math.pow(10, roomIdLength)-1
        var  num = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (checkRoomExist(num));
    return num.toString()
}

const checkRoomExist = (roomNum) => {
    var found = false
    activeRooms.forEach(ele => {
        if(ele.id == roomNum){
            found =  true;
            return found
        }
    })
    return found;
}

// join to a room
const joinToRoom = (socket, room) => { 
    var roomFound= false
    var roomObj = false;

    // search all active Rooms
    activeRooms.map((rm)=>{
        if(rm.id === room){
            roomFound = true

            // if room has less than 2 members join
            if(rm.members.length < 2){
                rm.members.push(socket)
                socket.join(room);
                roomObj = rm
            }

            // if room has 2 members then start the game
            if(roomObj && rm.members.length == 2){

                // notify 1st player
                socket.to(rm.id).emit("readyToPlay", {
                                opponent: rm.members[1].username,
                                yourPosition: true // LEFT
                            })

                // notify 2nd player
                rm.members[1].emit("readyToPlay", {
                                    opponent: rm.members[0].username,
                                    yourPosition: false //RIGHT
                                })
            }
        }
        return rm
    })

    // if room not exist then Create and join
    if(!roomFound){
        roomObj = { 
                id:room, 
                members: [socket]
            }
        activeRooms.push(roomObj)
        socket.join(room)
    }
    return roomObj
}

// exitTheRoom
const exitTheRoom = (socket) => {
    var roomFound = false;

    // check all active rooms
    activeRooms.map((rm)=>{
        if(rm.members.includes(socket)){
            socket.leave(rm.id)
            roomFound = true
            rm.members = rm.members.filter((member)=>{
                return member != socket
            })

            // notify other player that user left
            if(rm.members.length > 0){
                rm.members[0].emit("opponentLeft")
            }
        }
        return rm
    })

    // delete the room with 0 members
    activeRooms = activeRooms.filter((rm)=>{
        if(rm.members.length > 0)
            return rm;
    })
}

io.on('connection', (socket) => {
    var newUser = socket.handshake.query.name;
    socket.username = newUser;
    console.log(`${newUser} joined`);

    // return a room id and add them to the room
    socket.on("getRoomId",()=>{
        var roomId = createRoom();
        joinToRoom(socket, roomId);
        socket.emit("sendRoomId", roomId);
    })

    // if room exists and less than 2 members in the room join
    socket.on("tryToJoin", (roomId)=>{
        if(checkRoomExist(roomId)){
            if(joinToRoom(socket, roomId)){
                socket.emit("resultJoiningRoom",{status: true, text: "Success!!"})
            }else{
                socket.emit("resultJoiningRoom",{status: false, text: "Room is Full"})
            }
        }else{
            socket.emit("resultJoiningRoom",{status: false, text: "Invalid Code"})
        }
    })

    socket.on("exitRoom", ()=>{
        exitTheRoom(socket)
    })

    socket.on("disconnect",()=>{
        exitTheRoom(socket)
        console.log(`${socket.username} Disconnected`);
    })
})