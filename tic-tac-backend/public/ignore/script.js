const selectBox = document.querySelector(".select-box"),
    selectBtn = selectBox.querySelector(".options .select-button"),
    playBoard = document.querySelector(".play-board"),
    history = document.querySelector(".history"),
    players = document.querySelector(".players"),
    allBox = document.querySelector(".play-area"),
    resultBox = document.querySelector(".result-box"),
    wonText = resultBox.querySelector(".won-text"),
    replayBtn = resultBox.querySelector("button");

let socket = io();
let gameManager = new Game_Manager(3);
let xPlay, oPlay, timer, x, y, boardSize;

let playerXIcon = "fas fa-times",
    playerOIcon = "far fa-circle",
    playerSign = "O";
const map = new Map();

let setBoard = () => {
    xPlay = document.getElementById("player-x").value;
    oPlay = document.getElementById("player-y").value;
    boardSize = 3;
    gameManager = new Game_Manager(boardSize);
    for (let i = 0; i < boardSize; i++) {
        let sec = document.createElement("section");
        for (let j = 0; j < boardSize; j++) {
            let sp = document.createElement("span");
            sp.setAttribute("id", `${i}-${j}`);
            sp.setAttribute("onclick", "clickedBox(this)");
            sec.appendChild(sp);
        }
        allBox.appendChild(sec);
    }
    map.set("X", xPlay);
    map.set("O", oPlay);
   
    history.classList.remove("hide");
    history.classList.add("show");
    timer = declareWinner();
};
setBoard();
function clickedBox(element) {
    let str = element.id.split("-");
    x = parseInt(str[0]);
    y = parseInt(str[1]);
    if (gameManager.getCellAt(x, y) !== -1) {
        return;
    }
    if (gameManager.getCurrentPlayer() == 1) {
        playerSign = "O";
        element.innerHTML = `<i class="${playerOIcon}"></i>`;
        players.classList.remove("active");
    } else if (gameManager.getCurrentPlayer() == 0) {
        playerSign = "X";
        element.innerHTML = `<i class="${playerXIcon}"></i>`;
        players.classList.add("active");
    }
    let currentStepForButton = gameManager.getCurrentStep();
    let stepSection = document.getElementById('history-section');
    let extra = gameManager.getTotalStep();
    for (let i = currentStepForButton+1; i < extra; i++) {
        if (stepSection.querySelector(`#step-${i}`)!=null) {
            let tmp = document.querySelector(`#step-${i}`);
            stepSection.removeChild(tmp);
        }
    }
    gameManager.handleClickOnBoard(x, y);
    let currentStep = gameManager.getCurrentStep();
    
    let stepButton = document.createElement('span');
    stepButton.setAttribute("id",`step-${currentStep}`);
    stepButton.innerHTML = `Step ${currentStep}`;
    stepSection.appendChild(stepButton);
    history.appendChild(stepSection);
    stepButton.setAttribute('onclick', 'clickButton(this)');
    selectWinner();
}

socket.on('click', (msg)=>{
    console.log(msg instanceof TicTacToe);
    this.replace(state);
});

function clickButton(element) {
    let id = element.id.split('-');
    let index = parseInt(id[1]);
    let state = gameManager.clickOnStep(index);
    this.replace(state);
    
}

function declareWinner() {
    return setTimeout(() => {
        setTimeout(() => {
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
            history.classList.add("hide");
            history.classList.remove("show");
        }, 70);
        wonText.innerHTML = `Player ${map.get(playerSign)} won the game!`;
    }, 10000000000);
}

function selectWinner() {
    if (gameManager.getWinner() != -1) {
        setTimeout(() => {
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
            history.classList.add("hide");
            history.classList.remove("show");
        }, 70);
        wonText.innerHTML = `Player ${map.get(playerSign)} won the game!`;
    } else {
        if (gameManager.isDraw()) {
            setTimeout(() => {
                resultBox.classList.add("show");
                playBoard.classList.remove("show");
                history.classList.add("hide");
                history.classList.remove("show");
            }, 70);
            wonText.textContent = "Match has been drawn!";
        } else {
            if (timer) {   
                clearTimeout(timer);
            }
            timer = declareWinner();
        }
    }
}

replayBtn.onclick = () => {
    window.location.reload();
};

function replace(gameInstance) {
    
    if (gameInstance.getCurrentPlayer() == 0) {
        players.classList.remove("active");
    } else if (gameInstance.getCurrentPlayer() == 1) {
        players.classList.add("active");
    }
    playerSign = (parseInt(gameInstance.getCurrentPlayer())==0)?'O':'X';
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            element = document.getElementById(`${i}-${j}`);
            element.innerHTML = "";
            if (gameInstance.getCellAt(i, j) == 0) {
                element.innerHTML = `<i class="${playerXIcon}"></i>`;
            } else if(gameInstance.getCellAt(i, j) == 1) {
                element.innerHTML = `<i class="${playerOIcon}"></i>`;
            }
        }
    }
    
    this.selectWinner();
}
