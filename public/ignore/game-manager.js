import { TicTacToe } from "./tictactoe";
export class Game_Manager {
    constructor (boardSize) {
        let game = new TicTacToe(boardSize);
        this.stack = [game];
        this.step = 0;
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

    getWinner () {
        return this.getCurrentGame().getWinner();
    }

    isDraw() {
        return this.getCurrentGame().isDraw();
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
        this.step = this.stack.length-1;
        return true;
    }

}
