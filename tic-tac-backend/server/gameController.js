const Game = require('./gameManager');

class GameController {
    constructor() {
        this._runningGame = [];
    }

    getRunningGame() {
        return this._runningGame;
    }

    manageEvent(eventInfo) {
        if (eventInfo.eventName === 'new-player') {
            this._assignIntoGame(eventInfo);
        } else if (eventInfo.eventName === 'left-player') {
            this._removePlayer(eventInfo.playerId);
        } else if (eventInfo.eventName === 'click') {
            const games = this.getRunningGame();
            for (let i = 0; i < games.length; i++) {
                const players = games[i].getPlayers();
                if(players.length===2){
                    for (let player of players) {

                        if (player.getId() == eventInfo.id) {

                            games[i].click(eventInfo.id, eventInfo.cellId);
                            break;
                        }
                    }
                }

            }
        }
    }

    _assignIntoGame(playerInfo) {
        let isAnyoneWaiting;

        for (let i = 0; i < this.getRunningGame().length; i++) {
            if (this._runningGame[i].getPlayerCount() === 1) {
                console.log('new player added on a game');
                this._runningGame[i].addPlayer(playerInfo);
                isAnyoneWaiting = true;
                break;
            }
        }
        if (!isAnyoneWaiting) {
            this.__newGame(playerInfo);
        }
    }

    __newGame(playerInfo) {
        console.log('new game board initialized');
        let game = new Game(3);
        this._runningGame.push(game);
        game.addPlayer(playerInfo);
    }

    _closeGame(index) {
        this._runningGame.splice(index, 1);
    }

    _removePlayer(playerId) {
        const games = this.getRunningGame();
        for (let i = 0; i < games.length; i++) {
            const players = games[i].getPlayers();
            for (let player of players) {
                if (player.getId() == playerId) {
                    if (players.length === 1) {
                        this._closeGame(i);
                        console.log('game Closed');
                        return;
                    }
                    games[i].removePlayer(playerId);

                    console.log('player Removed');

                    return;

                }


            }
        }
    }


}

module.exports = GameController;