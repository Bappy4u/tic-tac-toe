const TicTacToe = require('./tictac');

class Game_Manager {
    constructor(boardSize) {
        const _game = new TicTacToe(boardSize);
        this.stack = [_game];
        this.step = 0;
        this.players = [];
        this.playerCount = 0;
        this.leftPlayerIndex = -1;
        this.isFinished = false;
        this.playerIcons = ['X', 'O'];
    }

    getPlayers(){
        return this.players;
    }

    getPlayerCount(){
        return this.playerCount;
    }

    addPlayers(playerId) {
        if(this.playerCount<2){
            if (this.leftPlayerIndex === 0) {
                this.players = [playerId].concat(this.players);
            } else {
                this.players.push(playerId);
            }

            this.playerCount++;
            return true;
        }
    }

    removePlayer(playerId){
        if (this.players.includes(playerId)) {
            this.playerCount--;
            this.leftPlayerIndex = this.players.indexOf(playerId);
            console.log('left player count:' + this.leftPlayerIndex);
            this.players.splice(this.leftPlayerIndex, 1);
            if (this.playerCount === 0) {
                this.leftPlayerIndex = -1;

            }

            return true;

        }
    }

    getCurrentStep() {
        return this.step;
    }

    getTotalStep() {
        return this.stack.length;
    }

    clickOnStep(clickedStep) {
        this.step = clickedStep;
        return this.stack[this.step];
    }

    getCurrentGame() {
        return this.stack[this.step];
    }

    getCellAt(x, y) {
        return this.getCurrentGame().getCellAt(x, y);
    }

    getCurrentPlayer() {
        return this.getCurrentGame().getCurrentPlayer();
    }

    getWinner() {
        return this.getCurrentGame().getWinner();
    }

    isDraw() {
        return this.getCurrentGame().isDraw();
    }
    click(playerId, msg){

        for (let p in this.players) {
            if (this.players[p] === playerId) {
                let playerSign;
                const str = msg.id.split('-');
                const x = parseInt(str[0]);
                const y = parseInt(str[1]);
                if (this.getCellAt(x, y) !== -1) {

                    return;
                }
                if (this.getCurrentPlayer() == 1) {
                    playerSign = "O";

                } else if (this.getCurrentPlayer() == 0) {
                    playerSign = "X";
                }
                // console.log(p, gameManager.getCurrentPlayer());
                if (p == this.getCurrentPlayer()) {
                    this.handleClickOnBoard(x, y);
                    const clickedBox = {
                        clicked: true,
                        playerSign: playerSign,
                    };
                    return clickedBox;
                }
                return;

            }
        }
    }

    handleClickOnBoard(x, y) {
        let newGame = this.stack[this.step].getCopy();
        let checkValid = newGame.click(x, y);
        if (!checkValid) {
            return false;
        }
        while (this.stack.length > this.step + 1) {
            this.stack.pop();
        }
        this.stack.push(newGame.getCopy());
        this.step = this.stack.length - 1;
        return true;
    }

}

module.exports = Game_Manager;