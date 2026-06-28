const {Server} = require('socket.io')
const {createRoomLocal, games, rooms, playerRoom, waitingPlayer, onlineRoom, easyRoom} = require('./RoomManger')
const {easyBot} = require('./bot');
let io;

function intiateServer(server){
    io = new Server(server);
    io.on('connection', (socket)=>{
        
        socket.on('local', ()=>{
            createRoomLocal(socket);
        })

        socket.on('online', ()=>{
            onlineRoom(socket);
        })

        socket.on('easy', ()=>{
            easyRoom(socket);
        })
        socket.on('move', (index) => {
            const room = rooms[socket.id];
            if(!room || !games[room]) return;
            const game = games[room];
            const player = playerRoom[room]
            if(player.type === 'online'){
                if(game.turn === 'X' && socket.id !== player.X) return;
                if(game.turn === 'O' && socket.id !== player.O) return;
            }
            game.makeMove(index)

            if(player.type === 'easy'){
                let botMove = easyBot(game.Board);
                
                if(game.turn === 'O'){
                    
                    game.makeMove(botMove);

                } 
                io.to(room).emit('gameState', game.gameState());
            }

            io.to(room).emit('gameState',game.gameState())
        })

        socket.on('restart', ()=>{
            const room = rooms[socket.id];
            if(!room || !games[room]) return;
            const game = games[room];
            game.restart()
            io.to(room).emit('gameState',game.gameState())
        })

        socket.on('disconnect', () => {
            if (waitingPlayer && waitingPlayer.id === socket.id) {
                waitingPlayer = null;
            }
            const room = rooms[socket.id];
            socket.to(room).emit('oppenetDiconnected');
            if (room) {
                delete games[room];
                delete rooms[socket.id];
                delete playerRoom[room];
            }
        });

        
    })
    return io;
}









module.exports = {
    intiateServer
}