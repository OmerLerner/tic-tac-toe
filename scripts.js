
let board;
let gameOverSwitch=false;
const humanPlayer= 'O';
const cpuPlayer = 'X';
const winningCombos=[[0,1,2],[3,4,5],[6,7,8], //horizontal win combinations
                     [0,3,6],[1,4,7],[2,5,8], //vertical win combinations
                     [0,4,8],[2,4,6]];        //diagonal win combinations
const tiles= document.querySelectorAll('.tile');
startGame();
function startGame()
{
    gameOverSwitch=false; //If someone has won, switch turns on to prevent CPU playing another turn
    document.querySelector(".end-container").style.display = "none";
    board=Array.from(Array(9).keys());
    for (i=0; i<tiles.length;i++)
    {
        tiles[i].innerText='';
        tiles[i].style.removeProperty('background-color');
        tiles[i].addEventListener('click',turnClick,false);
    }
}

function turnClick(square)
{
    if (typeof board[square.target.id] == 'number')
    {
        turn(square.target.id,humanPlayer);
        if (!checkForTie() && !gameOverSwitch) turn(bestSpot(), cpuPlayer);
    }
    
}


function turn(squareID, player)
{
    board[squareID]=player;
    document.getElementById(squareID).innerText = player;
    let gameWon = checkForWinner(board,player);
    if (gameWon)
        gameOver(gameWon);
}

function checkForWinner(board, player){
    let plays = board.reduce((a, e, i) => 
    (e === player) ? a.concat(i) : a, []); //Adds all indexes to array where player has played in
     let gameWon=null;
     for (let [index,win] of winningCombos.entries())
     {
        if (win.every(elem => plays.indexOf(elem) > -1)) 
        {
            gameWon= {index: index, player: player};
            break;
        }
     }
     return gameWon;
}
function checkForTie()
{
    if (emptySquares().length == 0)
    {
        for (i=0; i<tiles.length; i++)
        {
           tiles[i].style.backgroundColor = "green";
           tiles[i].removeEventListener('click', turnClick, false); 
        }
        declareWinner("Tie Game!")
        return true;
    }
    return false;
}
function declareWinner(who)
{
    document.querySelector(".end-container").style.display ="block";
    document.querySelector(".end-container .winner").innerText =who;

}
function emptySquares()
{
    return board.filter(s => typeof s =='number');
}

function bestSpot()
{
    return emptySquares()[0];
}

function gameOver(gameWon)
{
    gameOverSwitch=true;
    for (let index of winningCombos[gameWon.index])
    {
        document.getElementById(index).style.backgroundColor=
        gameWon.player==humanPlayer? "blue" : "red";
    }
    for (i=0; i<tiles.length; i++)
        tiles[i].removeEventListener('click', turnClick,false); //May need to remove this after each click aswell
    declareWinner(gameWon.player == humanPlayer ? "You Win!" : "You Lose!");

    }



















// const Player = (name)=>{
//     return {name};
// };

// const menuModule= (function (){
//     return{
//         createPlayer: function(){
//             const PLAYER_ONE = document.getElementById("player-1").value;
//             this.playerOne=Player(PLAYER_ONE);
//         }
//     }

// })





// const gameBoard = (()=>
// {
//     const mainBoard=Array.from(Array(9).keys());
//     return {mainBoard};
// })

// const game = (function (gmBoard) //add displayController later
// {
//     const humanPlayer= 'O';
//     const cpuPlayer ='X';
//     const winningCombos=[[0,1,2],[3,4,5],[6,7,8], //horizontal win combinations
//                          [0,3,6],[1,4,7],[2,5,8], //vertical win combinations
//                          [0,4,8],[2,4,6]];        //diagonal win combinations
//     const tiles=document.querySelectorAll(".tile");
//     function startGame()
//     {
//         document.querySelector(".end-container").style.display = "none";
//         clearBoard();
//     }
//     function clearBoard()
//     {
//         for (i=0;i <tiles.length; i++)
//         {
//             tiles[i].innerText='';
//             tiles[i].style.removeProperty('background-color');
//             tiles[i].addEventListener('click',turnClick,false);
//         }
//     }
//     function turnClick(square){
//         turn(square.target.id,humanPlayer); 
//     }
//     function turn(squareID, player)
//     {
//         gmBoard.mainBoard[squareID]=player;
//         document.getElementById(squareID).innerText=player;
//     }
//     function checkForWinner()
//     {
//         for (i=0; i<winningCombos.length(); i++)
//         {
//             if (gmBoard.mainBoard[winningCombos[i][0]]==gmBoard.mainBoard[winningCombos[i][1]] 
//                 && gmBoard.mainBoard[winningCombos[i][1]]==gmBoard.mainBoard[winningCombos[i][2]])
//             {
//                 if (gmBoard.mainBoard[winningCombos[i][0]]!=null && gmBoard.mainBoard[winningCombos[i][1]!=null && gmBoard.mainBoard[winningCombos[i][2]]!=null])
//                     return {value:gmBoard.mainBoard[winningCombos[i][0]], wonGame:true}
//             }
//         }
//         return {value:null, wonGame:false}
//     }
//     function checkForTie()
//     {
//         for (i=0; i<gmBoard.mainBoard.length(); i++)
//         {
//             if (gmBoard.mainBoard[i]==null)
//                 return false;
//         }
//         return true;
//     }

//     return {startGame};
// })(gameBoard); //displayController add later

// game.startGame();