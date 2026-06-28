

function easyBot(board){
    const availabel = [];
    for(let i = 0 ; i< board.length ; i++){
        if(board[i] === ""){
            availabel.push(i);
        }
    }
    return availabel[Math.floor(Math.random()* availabel.length)];
}

module.exports = {easyBot};