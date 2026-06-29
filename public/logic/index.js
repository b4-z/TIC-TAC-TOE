const tics = document.querySelectorAll('.tic-id');
const restartBtn = document.querySelector('#restart');
const overlay = document.querySelector('#overlay');
const newGame = document.querySelector('#newGame');
const turnTxt = document.querySelector('#turn');
const x = document.querySelector("#X");
const o = document.querySelector("#O");
const draws = document.querySelector("#draws");
const multiSingle = document.getElementById('m/s');
const easyHard = document.getElementById('e/h');
const localOnline = document.getElementById('l/o');

const logoutBtn = document.getElementById('logout-btn')

const single = document.getElementById('single');
const multi = document.getElementById('multi');
const hard = document.getElementById('hard');
const easy = document.getElementById('easy');
const online = document.getElementById('online');
const local = document.getElementById('local');
const main = document.getElementById('main');
const backBtn = document.querySelectorAll('.back-btn');
const exit = document.getElementById('exit');


const winPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];



import { io } from "/socket.io/socket.io.esm.min.js";


const socket = io();

socket.on('oppenetDiconnected', ()=>{
    alert('Opponent disconnected');
    main.classList.add('hidden')
    localOnline.classList.remove('hidden')
})

socket.on('gameState', (serverGame) => {
    tics.forEach((tic, index) => {
        tic.textContent = serverGame.Board[index];
    });
    x.textContent = "X's Win: " + serverGame.Xwin
    o.textContent = "O's Win: " + serverGame.Owin
    draws.textContent = "Draws: " + serverGame.draw
    turnTxt.textContent = "Turn: " + serverGame.turn;

    if(serverGame.isGameOver){
        overlay.classList.remove('hidden')
        for (let pattern of winPatterns){
            const [a, b, c] = pattern;
            if(tics[a].textContent && tics[a].textContent === tics[b].textContent 
                && tics[a].textContent === tics[c].textContent)
                {

                    tics[a].classList.add("border-green-700", "bg-green-100")
                    tics[b].classList.add("border-green-700", "bg-green-100")
                    tics[c].classList.add("border-green-700", "bg-green-100")
                }
        }
    }
});
tics.forEach((tic, index) => {
    tic.addEventListener('click', () => {
        if (tic.textContent === "") {
            socket.emit('move', index);
        }
    });
});

   

restartBtn.addEventListener('click',()=> socket.emit('restart'))
newGame.addEventListener('click',()=> {
    socket.emit('restart');
    overlay.classList.add('hidden')
    tics.forEach(tic =>{
        tic.classList.remove("border-green-700", "bg-green-100")
    })
})

single.addEventListener('click', ()=>{
    multiSingle.classList.add('hidden');
    easyHard.classList.remove('hidden');
})

multi.addEventListener('click', ()=>{
    multiSingle.classList.add('hidden');
    localOnline.classList.remove('hidden');
})

local.addEventListener('click', ()=>{
    localOnline.classList.add('hidden');
    main.classList.remove('hidden');
    socket.emit('local')
})
online.addEventListener('click', ()=>{
    localOnline.classList.add('hidden');
    main.classList.remove('hidden');
    socket.emit('online');
})
easy.addEventListener('click', ()=>{
    easyHard.classList.add('hidden');
    main.classList.remove('hidden');
    socket.emit('easy');
})

hard.addEventListener('click', ()=>{
    easyHard.classList.add('hidden');
    main.classList.remove('hidden');
    socket.emit('hard');
})

backBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        if(easyHard.classList.contains('hidden')){
            
            localOnline.classList.add('hidden');
            multiSingle.classList.remove('hidden');

        }else{

            easyHard.classList.add('hidden');
            multiSingle.classList.remove('hidden');

        }
        
        console.log("localOnline:", localOnline);
    console.log("has class hidden before:", localOnline?.classList.contains('hidden'));

    });
});

const logout = ()=>{
    window.location.href = '/logout'
}
logoutBtn.addEventListener('click', logout)

exit.addEventListener('click', ()=>{    
    const confirmExit = confirm();
    if(!confirmExit)return;
    if(socket.connected){
    socket.disconnect();
    }
    window.location.reload();
    

})

