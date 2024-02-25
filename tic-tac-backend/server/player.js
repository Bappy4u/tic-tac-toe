class Player{
    constructor(playerInfo){
        // this._players = [];
        this._name = playerInfo.name;
        this._id = playerInfo.id;
        this.socket = playerInfo.socket;
        this._icon;
    }
    getName(){
        return this._name;
    }
    sendMessage(message){
        message.name = this.getName();
        console.log(message.message);
        this.socket.send(JSON.stringify(message));
    }
    getId(){
        return this._id;
    }
    setIcon(icon){
        this._icon = icon;
    }
    getIcon(){
        this._icon;
    }

    // _addPlayer(playerInfo) {
    //     let newPlayer = {
    //         name: playerInfo.name,
    //         icon: 'X',
    //         id: playerInfo.id,
    //     }
    //
    //     if (this._players.length === 0 || this._players[this._players.length - 1].length === 2) {
    //         this._players.push([newPlayer])
    //
    //         console.log("one player joined and waiting for another player");
    //     } else {
    //         this._players[this._players.length - 1].push(newPlayer);
    //         console.log("second player joined and game will start");
    //     }
    // }
}

module.exports = Player;