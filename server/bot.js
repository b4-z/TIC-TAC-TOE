function easyBot(board){
    const availabel = [];
    for(let i = 0 ; i< board.length ; i++){
        if(board[i] === ""){
            availabel.push(i);
        }
    }
    return availabel[Math.floor(Math.random()* availabel.length)];
}

function hardBot(board, bot='O', currentTurn=null){
    // Minimax-based bot that can play as either 'O' or 'X'.
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    function checkWin(b, player){
        for(const p of winPatterns){
            const [a,b1,c] = p;
            if(b[a] === player && b[b1] === player && b[c] === player) return true;
        }
        return false;
    }

    function getAvailable(b){
        const moves = [];
        for(let i=0;i<b.length;i++) if(b[i]==="") moves.push(i);
        return moves;
    }

    const opponent = bot === 'O' ? 'X' : 'O';

    function minimax(b, depth, isMaximizing){
        if(checkWin(b, bot)) return 10 - depth;
        if(checkWin(b, opponent)) return depth - 10;
        const avail = getAvailable(b);
        if(avail.length === 0) return 0;

        if(isMaximizing){
            let best = -Infinity;
            for(const idx of avail){
                b[idx] = bot;
                const score = minimax(b, depth+1, false);
                b[idx] = '';
                if(score > best) best = score;
            }
            return best;
        } else {
            let best = Infinity;
            for(const idx of avail){
                b[idx] = opponent;
                const score = minimax(b, depth+1, true);
                b[idx] = '';
                if(score < best) best = score;
            }
            return best;
        }
    }

    // determine current turn: prefer explicit currentTurn, otherwise infer from board counts
    const xCount = board.filter(c => c === 'X').length;
    const oCount = board.filter(c => c === 'O').length;
    const inferredTurn = xCount === oCount ? 'X' : 'O';
    const turn = currentTurn || inferredTurn;
    const botToMove = turn === bot;

    const avail = getAvailable(board);
    if(avail.length === 0) return -1;

    let bestMove = avail[0];

    if(botToMove){
        let bestScore = -Infinity;
        for(const idx of avail){
            board[idx] = bot;
            const score = minimax(board, 0, false);
            board[idx] = '';
            if(score > bestScore){
                bestScore = score;
                bestMove = idx;
            }
        }
    } else {
        // opponent to move: simulate opponent moves and choose the move that minimizes opponent's advantage
        let bestScore = Infinity;
        for(const idx of avail){
            board[idx] = opponent;
            const score = minimax(board, 0, true);
            board[idx] = '';
            if(score < bestScore){
                bestScore = score;
                bestMove = idx;
            }
        }
    }

    return bestMove;
}

module.exports = {easyBot, hardBot};