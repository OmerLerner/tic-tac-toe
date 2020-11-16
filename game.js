const menuContainer = document.querySelector(".menu-container");

const Player = (name) => {
  return { name };
};

//Module handles creation of players & setting symbols

const menuModule = (function () {
  return {
    createPlayer: function () {
      const PLAYER_ONE = document.getElementById("player-1").value;
      this.playerOne = Player(PLAYER_ONE);
    },

    createHuman: function () {
      const PLAYER_TWO = document.getElementById("player-2").value;
      this.playerTwo = Player(PLAYER_TWO);
    },

    createComp: function () {
      this.computer = Player("CPU");
    },

    setOpponent: function (opp) {
      this.opponent = opp;
    },

    setChoice: function (sym) {
      this.symbol = sym;
    },

    clearInput: function () {
      const inputs = document.querySelectorAll(`#player-1, #player-2`);
      Array.from(inputs).forEach((input) => {
        input.value = "";
      });
    },
  };
})();

//Creates the Tic-Tac-Toe board
const gameBoard = (function () {
  const mainBoard = Array.from(Array(9).keys());
  return {
    mainBoard,
  };
})();

const displayController = (function () {
  return {
    displayMove: function (loc, move) {
      const tile = document.getElementById(loc);
      if (!tile) {
        return;
      }
      tile.classList.add(move);
    },

    displayWinner: function (winner) {
      const endContainer = document.querySelector(".end-container");
      const winMessage = document.querySelector(".winner");
      const playAgainBtn = document.querySelector(".play-again");

      endContainer.style.transform = "translateY(0)";
      winMessage.innerText = `${winner}`;

      playAgainBtn.addEventListener("click", function () {
        gameBoard.mainBoard = Array.from(Array(9).keys());
        endContainer.style.transform = "translateY(100%)";
        menuContainer.classList.remove("hide");
        delete menuModule.playerOne;
        delete menuModule.playerTwo;
        delete menuModule.computer;
        delete menuModule.opponent;
        delete menuModule.symbol;
      });
    },
  };
})();

const game = (function (gmBoard, dispCtrl) {
  const tiles = document.querySelectorAll(".tile");
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
  ];

  return {
    PlayGame: function (humanPlayer, opponent, versusMode) {

      let current = humanPlayer.move;
      let isGameOver = false;
      //Resets the board and adds event listeners to each space
      for (let i = 0; i < tiles.length; i++) {
        tiles[i].classList.remove("x");
        tiles[i].classList.remove("o");
        tiles[i].addEventListener("click", turnClick);
      }
      //The function that triggers when you click a space
      function turnClick(e) 
      {
        if (versusMode == "human") 
        {
          if (typeof gmBoard.mainBoard[e.target.id] == "number") 
          {
            //Checks by the X or O sign whether it's the player's turn or the opponent's turn, then simulates a turn and switches signs
            if (current == humanPlayer.move) 
            {
              turn(e.target.id, current);
              current = opponent.move;
            } 
            else if (current == opponent.move) 
            {
              turn(e.target.id, current);
              current = humanPlayer.move;
            }
          }
        } 
        //Process human player's choice, then use minimax to find the CPU's ideal move.
        else 
        {
          if (typeof gmBoard.mainBoard[e.target.id] == "number") 
          {
            turn(e.target.id, humanPlayer.move);
            if (!isGameOver) turn(bestSpot(), opponent.move);
          }
        }
      }
      //Adds the move to the board & draws it & checks for a winner or a tie
      function turn(squareID, currPlayerMove) 
      {
        gmBoard.mainBoard[squareID] = currPlayerMove;
        dispCtrl.displayMove(squareID, currPlayerMove);
        let gameWon = checkWin(gmBoard.mainBoard, currPlayerMove);
        if (gameWon) gameOver(gameWon);
        checkTie(gameWon);
      }

      function checkWin(board, playerMove) 
      {
        //Create an array which contains the index of every one of the player's moves
        let plays = board.reduce(
          (a, e, i) => (e === playerMove ? a.concat(i) : a),
          []
        );
        let gameWon = null;

        //Iterates the array to see if there are 3 indexes that match with winCombos
        for (let [index, win] of winCombos.entries()) 
        {
          if (win.every((elem) => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, playerMove: playerMove };
            break;
          }
        }
        return gameWon;
      }

      function gameOver(gameWon) 
      {
        isGameOver = true;
        //Removes event listeners to prevent user from clicking it after game is over
        for (let i = 0; i < tiles.length; i++) 
        {
          tiles[i].removeEventListener("click", turnClick);
        }

        if (gameWon.playerMove == humanPlayer.move) 
        {
          dispCtrl.displayWinner(`${humanPlayer.name} is the winner!`);
        } 
        else if (gameWon.playerMove == opponent.move) 
        {
          dispCtrl.displayWinner(`${opponent.name} is the winner!`);
        }
      }

      function checkTie(gameWon) {
        if (emptySquares(gmBoard.mainBoard).length == 0 && !gameWon) 
        {
          for (let i = 0; i < tiles.length; i++) 
          {
            tiles[i].removeEventListener("click", turnClick);
          }
          dispCtrl.displayWinner("It's a Tie!");
        }
      }
      //Returns all of the empty squares on the board
      function emptySquares() 
      {
        return gmBoard.mainBoard.filter((s) => typeof s == "number");
      }

      //Uses the minimax function in order to find the optimal spot for the AI to play on
      function bestSpot() 
      {
        return minimax(gmBoard.mainBoard, opponent.move).index;
      }

      function minimax(newBoard, player) 
      {
        //Limits the amount of spots to evaluate, improves runtime
        let availSpots = emptySquares();
        
        //Base recursion
        if (checkWin(newBoard, humanPlayer.move)) 
        {
          return { score: -10};
        } 
        else if (checkWin(newBoard, opponent.move)) 
        {
          return { score: 10};
        } 
        else if (availSpots.length === 0) 
        {
          return { score: 0};
        }

        let moves = [];
        //Simulates the result of the game after making a move on the available spot, the base recursion returns the "score" of each move
        for (let i = 0; i < availSpots.length; i++) 
        {
          let move = {};
          move.index = newBoard[availSpots[i]];
          newBoard[availSpots[i]] = player;

          if (player == opponent.move) 
          {
            let result = minimax(newBoard, humanPlayer.move);
            move.score = result.score;
          } 
          else 
          {
            let result = minimax(newBoard, opponent.move);
            move.score = result.score;
          }

          newBoard[availSpots[i]] = move.index;
          //Adds the move's index and score to the moves array
          moves.push(move);
        }

        let bestMove;
        //Iterates through the "moves" array, and chooses the best move to make based on it's score
        if (player === opponent.move) 
        {
          let bestScore = -10000;
          for (let i = 0; i < moves.length; i++) 
          {
            if (moves[i].score > bestScore) 
            {
              bestScore = moves[i].score;
              bestMove = i;
            }
          }
        } 
        else 
        {
          let bestScore = 10000;
          for (let i = 0; i < moves.length; i++) 
          {
            if (moves[i].score < bestScore) 
            {
              bestScore = moves[i].score;
              bestMove = i;
            }
          }
        }

        return moves[bestMove];
      }
    },
  };
})(gameBoard, displayController);

const controller = (function (menu) {
  const playerTwoInput = document.getElementById("player-2");
  const vsComp = document.getElementById("vs-comp");
  const vsHum = document.getElementById("vs-human");
  const xBtn = document.getElementById("x-btn");
  const oBtn = document.getElementById("o-btn");
  const START = document.querySelector(".start");

  //Toggles main menu buttons
  function switchActive(off, on) 
  {
    off.classList.remove("active");
    on.classList.add("active");
  }

  vsComp.addEventListener("click", function () 
  {
    vsHum.style.backgroundColor = "transparent";
    switchActive(vsHum, vsComp);
    menu.setOpponent("computer");
    playerTwoInput.style.display = "none";
  });

  vsHum.addEventListener("click", function () 
  {
    vsComp.dataset.content = "";
    vsComp.style.backgroundColor = "transparent";
    switchActive(vsComp, vsHum);
    menu.setOpponent("human");
    playerTwoInput.style.display = "block";
  });

  xBtn.addEventListener("click", function () 
  {
    oBtn.style.backgroundColor = "transparent";
    switchActive(oBtn, xBtn);
    menu.setChoice("x");
  });

  oBtn.addEventListener("click", function () 
  {
    xBtn.style.backgroundColor = "transparent";
    switchActive(xBtn, oBtn);
    menu.setChoice("o");
  });
  //Creates player objects and starts the game
  START.addEventListener("click", function () 
  {
    menu.createPlayer();
    let versus = menu.opponent;
    let player = menu.playerOne;
    let opponent;

    if (player.name == "") 
    {
      player.name = "Player 1";
    }
    //Toggles background of buttons to red if choice hasn't been made
    if (!versus) 
    {
      vsComp.style.backgroundColor = "rgb(185, 0, 0)";
      vsHum.style.backgroundColor = "rgb(185, 0, 0)";
      return;
    }
    if (!menu.symbol) {
      xBtn.style.backgroundColor = "rgb(185, 0, 0)";
      oBtn.style.backgroundColor = "rgb(185, 0, 0)";
      return;
    }

    if (versus == "computer") 
    {
      menu.createComp();
      opponent = menu.computer;
      if (menu.symbol == "x") 
      {
        player.move = "x";
        opponent.move = "o";
      } else if (menu.symbol == "o") 
      {
        player.move = "o";
        opponent.move = "x";
      }
      game.PlayGame(player, opponent, versus);
    } 
    else if (versus == "human") 
    {
      menu.createHuman();
      opponent = menu.playerTwo;
      if (opponent.name == "") 
      {
        opponent.name = "Player 2";
      }
      if (menu.symbol == "x") 
      {
        player.move = "x";
        opponent.move = "o";
      } 
      else if (menu.symbol == "o") 
      {
        player.move = "o";
        opponent.move = "x";
      }
      game.PlayGame(player, opponent, versus);
    }

    menu.clearInput();
    menuContainer.classList.add("hide");
    vsComp.style.backgroundColor = "transparent";
    vsComp.classList.remove("active");
    vsHum.style.backgroundColor = "transparent";
    vsHum.classList.remove("active");
    xBtn.style.backgroundColor = "transparent";
    xBtn.classList.remove("active");
    oBtn.style.backgroundColor = "transparent";
    oBtn.classList.remove("active");
    vsComp.dataset.content = "";
  });
})(menuModule);