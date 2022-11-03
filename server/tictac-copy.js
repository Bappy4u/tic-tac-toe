class TicTacToe {

    constructor(playBoardSize) {
        this.playBoardSize = playBoardSize;
        this.ar = [];
        this.firstPlayer = 0;
        this.secondPlayer = 1;
        this.runningPlayer = this.firstPlayer;
        this.moveNo = 0;
        this.winner = -1;
        for (let i = 0; i < playBoardSize; i++) {
            let arr = [];
            for (let j = 0; j < playBoardSize; j++) {
                arr.push(-1);
            }
            this.ar.push(arr);
        }
    }

    getCopy() {
        let newGame = new TicTacToe(this.playBoardSize);
        for (let i = 0; i < this.playBoardSize; i++) {
            for( let j = 0; j < this.playBoardSize; j++) {
                newGame.ar[i][j] = this.ar[i][j];
            }
        }
        newGame.firstPlayer = this.firstPlayer;
        newGame.secondPlayer = this.secondPlayer;
        newGame.runningPlayer = this.runningPlayer;
        newGame.moveNo = this.moveNo;
        newGame.winner = this.winner;
        return newGame;
    }

    getCellAt(x, y) {
        return this.ar[x][y];
    }

    click(x, y) {
        if (
            x > this.playBoardSize ||
            y > this.playBoardSize ||
            this.getCellAt(x, y) != -1
        ) {
            return false;
        } else {
            if (this.runningPlayer == 0) {
                this.ar[x][y] = 0;
            } else {
                this.ar[x][y] = 1;
            }
            this.moveNo++;
            let isWinner = this._checkWinner(this.runningPlayer);
            if (isWinner) {
                this.winner = this.runningPlayer;
                return true;
            }
            this.runningPlayer = (this.runningPlayer + 1) % 2;
            return true;
        }
    }

    _checkWinner(player) {
        let flag;
        for (let i = 0; i < this.playBoardSize; i++) {
            flag = 1;
            for (let j = 0; j < this.playBoardSize; j++) {
                if (this.getCellAt(i, j) != player) {
                    flag = 0;
                }
            }
            if (flag == 1) {
                return true;
            }
        }
        for (let i = 0; i < this.playBoardSize; i++) {
            flag = 1;
            for (let j = 0; j < this.playBoardSize; j++) {
                if (this.getCellAt(j, i) != player) {
                    flag = 0;
                }
            }
            if (flag == 1) {
                return true;
            }
        }
        flag = 1;
        for (let j = 0; j < this.playBoardSize; j++) {
            if (this.getCellAt(j, j) != player) {
                flag = 0;
            }
        }
        if (flag == 1) {
            return true;
        }
        flag = 1;
        for (let j = 0; j < this.playBoardSize; j++) {
            if (this.getCellAt(j, this.playBoardSize - 1 - j) != player) {
                flag = 0;
            }
        }
        if (flag == 1) {
            return true;
        }
        return false;
    }

    isDraw() {
        if (this.moveNo == this.playBoardSize * this.playBoardSize) {
            return true;
        }
        return false;
    }

    isFinished() {
        if (this.winner != -1) {
            return true;
        }
        if (this.isDraw()) {
            return true;
        }
        return false;
    }

    getWinner() {
        return this.winner;
    }

    getCurrentPlayer() {
        return this.runningPlayer;
    }

    Display() {
        for (let i = 0; i < this.playBoardSize; i++) {
            let str = '';
            for (let j = 0; j < this.playBoardSize; j++) {
                str += (this.ar[i][j]+' ');
            }
            console.log(str);
            console.log('');
        }
    }

}

function hello(){
    console.log("hello");
}

module.exports = TicTacToe