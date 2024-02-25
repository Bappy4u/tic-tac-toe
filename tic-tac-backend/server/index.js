const express = require('express');
const app = express();

const port = 8081;
const socket = require('socket.io');
const webSocket = require('ws');
const Game_Manager = require('./gameManager');
const GameController = require('./gameController');
const path = require('path');
const homePage = 'D:\\Assignment\\tic tac\\tic-tac-frontend\\index.html';
const fs = require('fs-extra');
initServer(homePage);

async function initServer(homepage){
    const gameController = new GameController();
    const websocketServer = new webSocket.Server({noServer: true });
    const server = app.listen(port);

    server.on('upgrade', (request, socket, head) => {
        websocketServer.handleUpgrade(request, socket, head, socket => {

            websocketServer.emit('connection', socket, request);
        })
    })

    websocketServer.on('connection', (socket, request) => {
        let userInfo;
        let id = request.headers['sec-websocket-key'];
        console.log(id);

        socket.onmessage = (event) => {
            const eventData = JSON.parse(event.data);
            eventData.id = id;
            eventData.socket = socket;
            gameController.manageEvent(eventData);

        }

        socket.onclose = (event) =>{
            eventData = {
                eventName: 'left-player',
                playerId: id
            }

            gameController.manageEvent(eventData);

        }


    })
    app.use(express.static('D:\\Assignment\\tic tac\\tic-tac-frontend\\'));
    app.get('/', (request, response) => {
        response.sendFile(homepage);
    });
}


//
//
// let gameManager = new Game_Manager(3);
//
// const io = socket(server);
//
//
// let isFinished = false;
//
//
// io.on('connection', (socket) => {
//
//
//     gameManager.addPlayer(socket.id);
//
//     if (gameManager.getPlayerCount() === 2) {
//
//         let state = gameManager.getCurrentGame();
//         socket.emit('state', state.ar);
//
//         const playerIndex = gameManager.getCurrentPlayer();
//         const players = gameManager.getPlayers();
//         io.emit('turn', players[playerIndex]);
//     } else if (gameManager.playerCount == 1) {
//         io.emit("wait", "Please wait for the opponent!");
//
//     }
//
//     socket.on('click', (msg) => {
//
//         const clickedBox = gameManager.click(socket.id, msg);
//
//         if(clickedBox.clicked){
//             io.emit('click', {id: msg.id, user: clickedBox.playerSign});
//         }
//
//         if (gameManager.getWinner() != -1) {
//             isFinished = true;
//             io.emit("winner", [gameManager.getWinner(), socket.id]);
//         } else if (gameManager.isDraw()) {
//             isFinished = true;
//             io.emit('draw', "Match drawn");
//         }
//
//
//     });
//
//     socket.on('disconnect', () => {
//         gameManager.removePlayer(socket.id);
//         const playerCount = gameManager.getPlayerCount();
//
//         if(playerCount<2){
//             io.emit("wait", "Please wait for the opponent!");
//         }
//     });
//
// })


// server.listen(port, () => {
//     console.log('example app listening on port', port);
// })