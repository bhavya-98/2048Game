const board = [];
let playerScores = [0, 0];
let currentPlayer = 0; // 0 = Player 1, 1 = Player 2
const boardSize = 4;

window.onload = () => {
  initGame();
  document.addEventListener("keydown", handleInput);
  document.getElementById("restart-btn").addEventListener("click", restartGame);
};

function initGame() {
  for (let r = 0; r < boardSize; r++) {
    board[r] = [];
    for (let c = 0; c < boardSize; c++) {
      board[r][c] = 0;
      const tile = document.createElement("div");
      tile.id = `${r}-${c}`;
      updateTile(tile, 0);
      document.getElementById("board").append(tile);
    }
  }
  addNewTile();
  addNewTile();
}

function updateTile(tile, num) {
  tile.className = "tile";
  if (num > 0) {
    tile.classList.add("tile-" + num);
    tile.textContent = num;
  } else {
    tile.textContent = "";
  }
}

function addNewTile() {
  let emptyTiles = [];
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (board[r][c] === 0) emptyTiles.push([r, c]);
    }
  }
  if (emptyTiles.length === 0) return;
  let [r, c] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  board[r][c] = 2;
  document.getElementById(`${r}-${c}`).textContent = "2";
  document.getElementById(`${r}-${c}`).classList.add("tile-2");
}

function handleInput(e) {
  let moved = false;
  switch (e.key) {
    case "ArrowLeft":
      moved = slideLeft();
      break;
    case "ArrowRight":
      moved = slideRight();
      break;
    case "ArrowUp":
      moved = slideUp();
      break;
    case "ArrowDown":
      moved = slideDown();
      break;
    default:
      return;
  }

  if (moved) {
    addNewTile();
    updateBoard();
    if (isGameOver()) {
      endGame();
      return;
    }
    switchTurn();
  }
}

function slide(row) {
  row = row.filter(num => num);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      playerScores[currentPlayer] += row[i];
      row[i + 1] = 0;
    }
  }
  row = row.filter(num => num);
  while (row.length < boardSize) row.push(0);
  return row;
}

function slideLeft() {
  let moved = false;
  for (let r = 0; r < boardSize; r++) {
    let newRow = slide(board[r]);
    if (JSON.stringify(board[r]) !== JSON.stringify(newRow)) moved = true;
    board[r] = newRow;
  }
  return moved;
}

function slideRight() {
  let moved = false;
  for (let r = 0; r < boardSize; r++) {
    let reversed = [...board[r]].reverse();
    let newRow = slide(reversed).reverse();
    if (JSON.stringify(board[r]) !== JSON.stringify(newRow)) moved = true;
    board[r] = newRow;
  }
  return moved;
}

function slideUp() {
  let moved = false;
  for (let c = 0; c < boardSize; c++) {
    let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
    let newCol = slide(col);
    for (let r = 0; r < boardSize; r++) {
      if (board[r][c] !== newCol[r]) moved = true;
      board[r][c] = newCol[r];
    }
  }
  return moved;
}

function slideDown() {
  let moved = false;
  for (let c = 0; c < boardSize; c++) {
    let col = [board[0][c], board[1][c], board[2][c], board[3][c]].reverse();
    let newCol = slide(col).reverse();
    for (let r = 0; r < boardSize; r++) {
      if (board[r][c] !== newCol[r]) moved = true;
      board[r][c] = newCol[r];
    }
  }
  return moved;
}

function updateBoard() {
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      const tile = document.getElementById(`${r}-${c}`);
      updateTile(tile, board[r][c]);
    }
  }
  document.getElementById("player1-score").textContent = `Player 1 Score: ${playerScores[0]}`;
  document.getElementById("player2-score").textContent = `Player 2 Score: ${playerScores[1]}`;
}

function switchTurn() {
  currentPlayer = currentPlayer === 0 ? 1 : 0;
  document.getElementById("turn").textContent = `Player ${currentPlayer + 1}’s Turn`;
}

function isGameOver() {
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (board[r][c] === 0) return false;
      if (c < boardSize - 1 && board[r][c] === board[r][c + 1]) return false;
      if (r < boardSize - 1 && board[r][c] === board[r + 1][c]) return false;
    }
  }
  return true;
}

function endGame() {
  document.getElementById("game-over").style.display = "block";
  let winnerText = "";
  if (playerScores[0] > playerScores[1])
    winnerText = "🏆 Player 1 Wins!";
  else if (playerScores[1] > playerScores[0])
    winnerText = "🏆 Player 2 Wins!";
  else
    winnerText = "🤝 It's a Draw!";
  document.getElementById("winner").textContent = winnerText;
  document.getElementById("winner").style.display = "block";
}

function restartGame() {
  document.getElementById("board").innerHTML = "";
  playerScores = [0, 0];
  currentPlayer = 0;
  document.getElementById("turn").textContent = "Player 1’s Turn";
  document.getElementById("game-over").style.display = "none";
  document.getElementById("winner").style.display = "none";
  initGame();
  updateBoard();
}
