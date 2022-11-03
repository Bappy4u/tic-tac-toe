const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 3000;
const path = require('path');
const socket = require('socket.io');
const Game_Manager = require('./game-manager');

let gameManager = new Game_Manager(3);

const io = socket(server);

app.use(express.static('public'));


// sendFile will go here
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let playerCount = 0;
let players = [];
let playersIcon = [];
let isFinished = false, socket_id;
let leftPlayerIndex;

io.on('connection', (socket) => {

    if (playerCount < 2) {
        if (leftPlayerIndex == 0) {
            players = [socket.id].concat(players);
        } else {
            players.push(socket.id);
        }

        isFinished = false;
        playersIcon[0] = 'X';
        playersIcon[1] = 'O';
        playerCount++;
        if (gameManager.playerCount === 2) {
            let state = gameManager.getCurrentGame();
            socket.emit('state', state.ar);
            // console.log(state.ar);
        }


    }
    if (playerCount == 1) {
        io.emit("wait", "Please wait for the opponent!");

    }
    if (playerCount == 2) {
        let playerIndex = gameManager.getCurrentPlayer();
        console.log("turn: " + playerIndex, ", " + players[playerIndex]);
        io.emit('turn', players[playerIndex]);
    }

    console.log('Connected on ', leftPlayerIndex + " players:" + players);

    socket.on('click', (msg) => {
        // console.log(gameManager);
        console.log(isFinished);
        // console.log(playerCount, players, socket.id);
        if (playerCount == 2 && isFinished == false) {
            console.log(isFinished, 'entered');
            for (let p in players) {
                if (players[p] == socket.id) {
                    // console.log('returned');
                    // console.log();
                    let str = msg.id.split('-');
                    let x = parseInt(str[0]);
                    let y = parseInt(str[1]);
                    if (gameManager.getCellAt(x, y) !== -1) {

                        return;
                    }
                    if (gameManager.getCurrentPlayer() == 1) {
                        playerSign = "O";

                    } else if (gameManager.getCurrentPlayer() == 0) {
                        playerSign = "X";
                    }
                    // console.log(p, gameManager.getCurrentPlayer());
                    if (p == gameManager.getCurrentPlayer()) {
                        gameManager.handleClickOnBoard(x, y);
                        io.emit('click', {id: msg.id, user: playerSign});
                        io.emit('turn', players[gameManager.getCurrentPlayer()]);
                        if (gameManager.getWinner() != -1) {
                            isFinished = true;
                            io.emit("winner", [gameManager.getWinner(), socket.id]);
                        } else if (gameManager.isDraw()) {
                            isFinished = true;
                            io.emit('draw', "Match drawn");
                        }


                    }

                }
            }
        }
        // if(playerCount==2){
        //     if(socket.id==playerOne){
        //         io.emit('click', {id: msg.id, user: 'X'});
        //     }else{
        //         io.emit('click', {id: msg.id, user: 'O'});
        //     }

        // }

    });

    socket.on('disconnect', () => {
        if (players.includes(socket.id)) {
            playerCount--;
            leftPlayerIndex = players.indexOf(socket.id);
            console.log('left player count:' + leftPlayerIndex);
            players.splice(leftPlayerIndex, 1);
            if (playerCount === 0) {
                leftPlayerIndex = -1;
                io.emit('restart', "restart all");
                gameManager = new Game_Manager(3);
            }
            io.emit("wait", "Please wait for the opponent!");
        }

    });

})


server.listen(port, () => {
    console.log('example app listening on port', port);
})