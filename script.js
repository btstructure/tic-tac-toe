// JS has 4 parts
// 1. Variables and the ability to click a square
// 2. Logic, determining a winner
// 3. Basic AI and winner notification
// 4. Minimax algorithm - so the AI can never lose

var origBoard; //initialize the board, and eventually becomes an array that keeps track of what is within the cell
const huPlayer = "O"; //human player
const aiPlayer = "X"; //AI

// this variable is an array filled with arrays, the array within displays the combinations to win tic tac toe, left to right, up and down, and diagonally
//don't foget comma's after the array
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

const cells = document.querySelectorAll(".cell"); //selects each element with the class of cell
startGame(); //a function to start the game

//defining startGame
function startGame() {
  document.querySelector(".endgame").style.display = "none"; //select the endgame element and the style is set to the display property to none when resetting the game
  origBoard = Array.from(Array(9).keys()); //makes the array from 0 to 9, creates an array of 9 elements
  console.log(origBoard);
  //remove the x and o's when resetting using a for loop
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color"); //when someone wins each square is highlighted for the combination, when the game restarts this should be removed
    cells[i].addEventListener("click", turnClick, false); // a click event listener, and call the turnClick function
  }
}

// the turnclcik function that is called by the eventListen on line 36, when user clicks it'll put down their mark
function turnClick(square) {
  if (typeof origBoard[square.target.id] == "number") {
    //if the square is a number then it is empty
    turn(square.target.id, huPlayer); //call the turn function and pass the id of the square and the huPlayer
    if (!checkWin(origBoard, huPlayer) && !checkTie())
      turn(bestSpot(), aiPlayer); //if the game is not tied then it is the ai's turn
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player; //set the board array at the id we click to player
  document.getElementById(squareId).innerText = player; //updates the display and the innertext is set equal to player
  let gameWon = checkWin(origBoard, player); //checkWin is another function and pass origBoard (shows where the x and o's are) and the current player
  if (gameWon) gameOver(gameWon); //when the game is won the gameOver function is called and passes the greenWon variable
}

//receives the board and player as parameters, the reason the board is passed because later
function checkWin(board, player) {
  //reduce method goes through the array and checks if the player is equal to the player,
  //if it is it will concatinate the index to the array, if not it will return the array
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  //checks if the game is won, if it is it will return the index and the player, it will go through the winCombos array and check if the player has all the indexes in the array
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}


//when the game is won the gameOver function is called and passes the greenWon variable
function gameOver(gameWon) {
  //highlights the winning combination with a for loop and the index of the winning combination
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == huPlayer ? "blue" : "red";
  }
  //goes through every cell and removes the event listener so the user can't click anymore square
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

//this function will display the winner and the endgame element will be displayed
function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

//filters every elemtn in the array and if it is a number it will return it
function emptySquares() {
  return origBoard.filter((s) => typeof s == "number");
}

//this function will return the best spot for the ai to play, it will return the index of the empty square
function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

//checks if the game is tied by checking if there are any empty squares
function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

//minimax algorithm makes the ai unbeatable
function minimax(newBoard, player) {
  var availSpots = emptySquares();

  if (checkWin(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
