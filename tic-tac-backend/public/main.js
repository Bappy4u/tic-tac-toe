
var socket = io("http://127.0.0.1:4000/");
let warning;
let topBar = document.querySelector('.turn');
let btns = document.querySelectorAll('td');

for (i of btns) {
  i.addEventListener('click', function() {
    
    if(this.textContent==""){
      console.log(this.id, socket.id);
      socket.emit('click', {id: this.id, user: socket.id});
      
    }
    
  });
}

socket.on('wait', (msg)=>{
  topBar.textContent = msg;
});

socket.on('click', (msg)=>{
    let item = document.getElementById(msg.id);
    item.textContent = msg.user;

});



socket.on('draw', (msg) => {
  warning = "Match drawn!";
  topBar.textContent = warning;
})

socket.on('turn', (id)=>{
  
  if (socket.id!=id){
    warning = "Opponent's turns";
    
  }
  else{
    warning = "Your turn";
  }
  topBar.textContent = warning;
});

socket.on('winner', (msg)=>{
  if(socket.id==msg[1]){
    warning = "Congrats! You won the match!";

  }
  else{
    warning = "You lost the match! :( ";
  }
  
  topBar.textContent = warning;

});

socket.on('restart', (msg)=>{
  console.log("Asche");
  for(let b of btns){
    b.textContent = "";
  }
});

socket.on('state', (state)=>{
  console.log(state);
  console.log("Kisu na");
  for(let i=0; i<state.length; i++){
    for(let j=0; j<state[i].length; j++){
      let id = i + "-" + j;
      let value = "";
      if(state[i][j]==0){
        value = 'X';
      } else if (state[i][j]==1){
        value = 'O';
      }
      document.getElementById(id).textContent = value;
    }
  }
});