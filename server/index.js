const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 3000;
const socket = require('socket.io');
const Game_Manager = require('./game-manager');

let gameManager = new Game_Manager(3);

const io = socket(server);

app.use(express.static('public'));


// sendFile will go here
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
});


let isFinished = false;


io.on('connection', (socket) => {


    gameManager.addPlayers(socket.id);

    if (gameManager.getPlayerCount() === 2) {

        let state = gameManager.getCurrentGame();
        socket.emit('state', state.ar);

        const playerIndex = gameManager.getCurrentPlayer();
        const players = gameManager.getPlayers();
        io.emit('turn', players[playerIndex]);
    } else if (gameManager.playerCount == 1) {
        io.emit("wait", "Please wait for the opponent!");

    }

    socket.on('click', (msg) => {

        const clickedBox = gameManager.click(socket.id, msg);

        if(clickedBox.clicked){
            io.emit('click', {id: msg.id, user: clickedBox.playerSign});
        }

        if (gameManager.getWinner() != -1) {
            isFinished = true;
            io.emit("winner", [gameManager.getWinner(), socket.id]);
        } else if (gameManager.isDraw()) {
            isFinished = true;
            io.emit('draw', "Match drawn");
        }


    });

    socket.on('disconnect', () => {
        gameManager.removePlayer(socket.id);
        const playerCount = gameManager.getPlayerCount();

        if(playerCount<2){
            io.emit("wait", "Please wait for the opponent!");
        }
    });

})


server.listen(port, () => {
    console.log('example app listening on port', port);
})