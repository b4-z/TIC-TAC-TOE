const Game = require('../model/Game')
const crypto = require('crypto')


const games = {}
const rooms = {}
const playerRoom = {}

let waitingPlayer = null;

function createRoomLocal(socket){
    let room = crypto.randomUUID();
    rooms[socket.id] = room;
    games[room] = new Game();
    socket.join(room);
    playerRoom[room] = {type: 'local'}
    socket.emit('gameState', games[room].gameState())
}


function onlineRoom(socket){
    
    if(!waitingPlayer){
        waitingPlayer = socket
        let room = crypto.randomUUID();
        rooms[socket.id] = room;
        games[room] = new Game();
        socket.join(room);
        playerRoom[room] = {X: socket.id, O: null, type: 'online'}
        socket.emit('waiting', {msg: 'waiting'})
        return
    }
    const partner = waitingPlayer;
    waitingPlayer = null;


    
    const room = rooms[partner.id];
    // FIX: If the partner left, make THIS socket the new waiting player instead of crashing
    if (!playerRoom[room]) {
        waitingPlayer = socket;
        let newRoom = crypto.randomUUID();
        rooms[socket.id] = newRoom;
        games[newRoom] = new Game();
        socket.join(newRoom);
        playerRoom[newRoom] = {X: socket.id, O: null, type: 'online'}
        socket.emit('waiting', {msg: 'waiting'})
        return;
    }

    rooms[socket.id] = room;

    playerRoom[room].O = socket.id;

    socket.join(room);

    partner.emit('assgin', 'X')
    socket.emit('assign', 'O')

    games[room].restart()
    socket.to(room).emit('gameState', games[room].gameState())
    socket.emit('gameState', games[room].gameState())
}




module.exports = {createRoomLocal, games, rooms, playerRoom,waitingPlayer, onlineRoom};