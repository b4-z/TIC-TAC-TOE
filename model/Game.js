// i could use exports and make the object to call from the cntroller 
// which would be easier but mesier 
class Game{
    constructor(){
    
    this.Board = [
        "","","",
        "","","",
        "","","" 
    ];

        this.winPatterns = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
        ];

        this.Xwin = 0
        this.Owin = 0
        this.draw = 0
        this.turn = "X"
        this.isGameOver = false
    }

    gameState(){
        return{
            Board:this.Board,
            Xwin: this.Xwin,
            Owin: this.Owin,
            isGameOver: this.isGameOver,
            turn: this.turn,
            draw: this.draw
        }
    }
    checkWin(){
        for(let pattern of this.winPatterns){
            const [a,b,c] = pattern;
            
            if(this.Board[a] && this.Board[a] == this.Board[b] && this.Board[a] == this.Board[c]){
                return true;
            }
        
        }
        return false
    }

    makeMove(index){
        if(this.isGameOver || this.Board[index] !== "") return;
        this.Board[index] = this.turn;
        if(this.checkWin()){
            this.isGameOver = true;
            if(this.turn === "X") this.Xwin += 1;
            if(this.turn === "O") this.Owin += 1;
        }
        else if (this.Board.every(cell => cell !=="") && !this.checkWin()){
            this.draw += 1;
            this.isGameOver = true;
        }

        if (this.isGameOver) return;
        this.turn = this.turn === "X" ? "O" : "X";
    }

    restart(){
        this.Board.fill("");
        this.turn = "X";
        this.isGameOver = false
    }




 

}

module.exports = Game;
