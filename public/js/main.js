const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const winningMessageElement = document.getElementById("winningMessage");
const restartButton = document.getElementById("restartButton");
const resetButton = document.getElementById("resetButton");
const winningMessageTextElement = document.querySelector(
  "[data-winning-message-text]"
);
const resultsList = document.getElementById("resultsList");
let playerScore = 0;
let computerScore = 0;
let tieScore = 0;
let gameResults = getStoredResults() || [];

startGame();

restartButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

function initializeGame() {
  circleTurn = false;
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove("show");
}

function startGame() {
  initializeGame();
}

function resetGame() {
  initializeGame();

  gameResults = [];
  storeResults();
  updateResultsDisplay();
  playerScore = 0;
  computerScore = 0;
  tieScore = 0;
  updateScores();
}

function handleClick(e) {
  const cell = e.target;
  if (
    cell.classList.contains(X_CLASS) ||
    cell.classList.contains(CIRCLE_CLASS)
  ) {
    return;
  }
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;

  placeMark(cell, currentClass);

  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    setTimeout(() => {
      const emptyCells = Array.from(cellElements).filter(
        (cell) =>
          !cell.classList.contains(X_CLASS) &&
          !cell.classList.contains(CIRCLE_CLASS)
      );

      const computerMove =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      placeMark(computerMove, CIRCLE_CLASS);

      if (checkWin(CIRCLE_CLASS)) {
        endGame(false, CIRCLE_CLASS);
      } else if (isDraw()) {
        endGame(true, null);
      } else {
        setBoardHoverClass();
      }
    }, 250);
  }
}

function endGame(draw, winner) {
  const currentDate = new Date();
  const result = {
    date: currentDate.toLocaleDateString(),
    time: currentDate.toLocaleTimeString(),
    winner: draw ? "Tie" : winner === CIRCLE_CLASS ? "Computer" : "Player",
  };
  gameResults.push(result);
  storeResults();
  updateResultsDisplay();
  if (draw) {
    winningMessageTextElement.innerText = "Draw!";
    tieScore++;
    updateScores();
  } else {
    winningMessageTextElement.innerText = `${
      winner === CIRCLE_CLASS ? "O's" : "X's"
    } Wins!`;
    if (winner === CIRCLE_CLASS) {
      computerScore++;
    } else {
      playerScore++;
    }
    updateScores();
  }
  winningMessageElement.classList.add("show");
}
function isDraw() {
  return [...cellElements].every((cell) => {
    return (
      cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    );
  });
}
function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}
function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function updateScores() {
  document.querySelector(".score-player").innerText = playerScore;
  document.querySelector(".score-computer").innerText = computerScore;
  document.querySelector(".score-tie").innerText = tieScore;
}

function updateResultsDisplay() {
  resultsList.innerHTML = "";
  gameResults.forEach((result) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${result.date} ${result.time} - Winner: ${result.winner}`;
    resultsList.appendChild(listItem);
  });
}
function storeResults() {
  localStorage.setItem("gameResults", JSON.stringify(gameResults));
}
function getStoredResults() {
  const storedResults = localStorage.getItem("gameResults");
  return storedResults ? JSON.parse(storedResults) : null;
}
