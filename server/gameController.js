class GameController {
    constructor() {
        this._runningGame = [];
        this._players = [];

    }

    manageEvent(obj) {

        if (obj.eventName === 'new-player') {
            this._addPlayer(obj);
        }

    }

    _addPlayer(obj) {
        let newPlayer = {
            name: obj.name,
            icon: 'X',
            id: obj.id,
        }

        if (this._players.length === 0 || this._players[this._players.length - 1].length === 2) {
            this._players.push([newPlayer])

            console.log("one player joined and waiting for another player");
        } else {
            this._players[this._players.length - 1].push(newPlayer);
            console.log("second player joined and game will start");
        }
    }
}
module.exports = GameController;