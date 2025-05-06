const boardEl = document.getElementById("board");
const turnEl = document.getElementById("turn");

let currentPlayer = "white"; // Oder "black"
let selectedCell = null;

const startPosition = [
  ["r", "n", "b", "q", "k", "b", "n", "r"], // schwarz
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"]  // weiß
];

// Farben erkennen
function getColor(piece) {
  if (piece === "") return null;
  return piece.toLowerCase() === piece ? "black" : "white";
}

// Brett rendern
function renderBoard() {
  boardEl.innerHTML = "";
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      const isWhiteSquare = (row + col) % 2 === 0;
      cell.classList.add(isWhiteSquare ? "white" : "black");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.textContent = startPosition[row][col];

      cell.addEventListener("click", () => handleClick(cell, row, col));

      boardEl.appendChild(cell);
    }
  }
}

// Klicklogik: Auswahl und Bewegung
function handleClick(cell, row, col) {
  const piece = startPosition[row][col];
  const color = getColor(piece);

  if (selectedCell) {
    const fromRow = selectedCell.dataset.row;
    const fromCol = selectedCell.dataset.col;
    const fromPiece = startPosition[fromRow][fromCol];

    if (color !== currentPlayer || piece === "") {
      // Zug durchführen
      startPosition[row][col] = fromPiece;
      startPosition[fromRow][fromCol] = "";
      selectedCell.classList.remove("selected");
      selectedCell = null;

      // Spielerwechsel
      currentPlayer = currentPlayer === "white" ? "black" : "white";
      turnEl.textContent = `Zug: ${currentPlayer === "white" ? "Weiß" : "Schwarz"}`;
    } else {
      selectedCell.classList.remove("selected");
      selectedCell = cell;
      cell.classList.add("selected");
      return;
    }

    renderBoard();
  } else {
    if (color === currentPlayer) {
      selectedCell = cell;
      cell.classList.add("selected");
    }
  }
}

// Überprüfen, ob der Zug gültig ist
function isMoveValid(piece, fromRow, fromCol, toRow, toCol, board) {
  switch (piece.toLowerCase()) {
    case "p":
      return isPawnMoveValid(fromRow, fromCol, toRow, toCol, piece, board);
    case "r":
      return isRookMoveValid(fromRow, fromCol, toRow, toCol, board);
    case "n":
      return isKnightMoveValid(fromRow, fromCol, toRow, toCol);
    case "b":
      return isBishopMoveValid(fromRow, fromCol, toRow, toCol, board);
    case "q":
      return isQueenMoveValid(fromRow, fromCol, toRow, toCol, board);
    case "k":
      return isKingMoveValid(fromRow, fromCol, toRow, toCol);
  }
}

// Beispiel für die gültige Bewegung eines Bauern
function isPawnMoveValid(fromRow, fromCol, toRow, toCol, piece, board) {
  const direction = piece === "p" ? 1 : -1; // Schwarze Bauern gehen nach unten, weiße nach oben
  if (fromCol === toCol && board[toRow][toCol] === "") {
    // Ein Feld vorwärts
    if (toRow === fromRow + direction) return true;
    // Erster Zug: Zwei Felder vorwärts
    if ((fromRow === 1 || fromRow === 6) && toRow === fromRow + 2 * direction) {
      return board[toRow][toCol] === ""; // Muss leer sein
    }
  }
  return false;
}

// Gültige Springerbewegung (L-Form)
function isKnightMoveValid(fromRow, fromCol, toRow, toCol) {
  const dx = Math.abs(toCol - fromCol);
  const dy = Math.abs(toRow - fromRow);
  return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
}

// Weitere Bewegungslogiken wie für Turm, Läufer, Dame, König hinzufügen...

// Initiales Brett anzeigen
renderBoard();
