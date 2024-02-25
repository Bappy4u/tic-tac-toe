let socket = new WebSocket('ws://localhost:8081/');
let warning;
let topBar = document.querySelector('.turn');
let bottomBar = document.querySelector('.turn .message');
let btns = document.querySelectorAll('td');
const board = document.querySelector('.tic');
const userInfo = {};
const entryFormElement = document.querySelector('.entry-form');


let playerInfo;
socket.onopen = function (event) {
    sendUserInfo();
};

socket.onclose = (event) => {

    playerInfo = {
        eventName: 'left-player',
        name: userInfo.name,
        id: userInfo.id
    }
    socket.send(JSON.stringify(playerInfo));
}

const sendUserInfo = () => {
    entryFormElement.onsubmit = (e) => {
        e.preventDefault();
        e.target.parentNode.classList = 'hide';
        bottomBar.classList.remove('hide');
        const name = e.target.elements.nameInput.value;
        board.classList.remove('hide');
        const date = new Date();
        userInfo.id = name + date.getDate() + date.getMonth();
        userInfo.name = name;

        playerInfo = {
            eventName: 'new-player',
            name: userInfo.name,
            id: userInfo.id
        }
        socket.send(JSON.stringify(playerInfo));
    }
}


socket.onmessage = (event) => {
    const eventData = JSON.parse(event.data);
    if (eventData.title == 'start' || eventData.title == 'wait') {
        bottomBar.textContent = "Hello " + eventData.name + "! " + eventData.message;
    }

    if (eventData.title == 'state') {
        updateBoard(eventData.message);
    }

}
let updateBoard = (state) => {
    console.log(state);
    for (let i = 0; i < state.length; i++) {
        for (let j = 0; j < state[i].length; j++) {
            let id = i + "-" + j;
            let value = "";
            if (state[i][j] == 0) {
                value = 'X';
            } else if (state[i][j] == 1) {
                value = 'O';
            }
            document.getElementById(id).textContent = value;
        }
    }
}


for (let i of btns) {
    i.addEventListener('click', function () {

        if (this.textContent == "") {
            console.log(this.id, socket.id);
            const clickInfo = {
                eventName: 'click',
                name: userInfo.name,
                cellId: this.id
            }

            socket.send(JSON.stringify(clickInfo));
        }

    });
}

socket.on('wait', (msg) => {
  topBar.textContent = msg;
});

socket.on('click', (msg) => {
  let item = document.getElementById(msg.id);
  item.textContent = msg.user;

});


socket.on('draw', (msg) => {
  warning = "Match drawn!";
  topBar.textContent = warning;
})

socket.on('turn', (id) => {

  if (socket.id != id) {
    warning = "Opponent's turns";

  } else {
    warning = "Your turn";
  }
  topBar.textContent = warning;
});

socket.on('winner', (msg) => {
  if (socket.id == msg[1]) {
    warning = "Congrats! You won the match!";

  } else {
    warning = "You lost the match! :( ";
  }

  topBar.textContent = warning;

});

socket.on('restart', (msg) => {
  console.log("Asche");
  for (let b of btns) {
    b.textContent = "";
  }
});

socket.on('state', (state) => {
  console.log(state);
  console.log("Kisu na");
  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state[i].length; j++) {
      let id = i + "-" + j;
      let value = "";
      if (state[i][j] == 0) {
        value = 'X';
      } else if (state[i][j] == 1) {
        value = 'O';
      }
      document.getElementById(id).textContent = value;
    }
  }
});