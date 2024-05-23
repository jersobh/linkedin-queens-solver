// Function to mark a cell as containing a crown
function markQueen(cellIdx) {
  const cell = document.querySelector(`div[data-cell-idx='${cellIdx}']`);
  if (cell) {
    const cellContent = cell.querySelector('.cell-content');
    if (cellContent) {
      // Simulate click event (same logic as before)
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      cellContent.dispatchEvent(event);
      cell.style.border = '2px solid red';
    }
  }
}

// Function to check if a queen can be placed on the board at (row, col)
function isSafe(board, row, col) {
  const size = board.length;

  // Check row and column
  for (let i = 0; i < size; i++) {
    if (board[row][i] || board[i][col]) return false;
  }

  // Check adjacent cells (diagonals next to the cell)
  const adjOffsets = [-1, 1];
  for (let dx of adjOffsets) {
    for (let dy of adjOffsets) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size && board[newRow][newCol]) return false;
    }
  }

  return true;
}

// Function to place crowns visually based on the solved board configuration
function placeCrowns(board) {
  const size = board.length;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j]) {
        const cellIdx = i * size + j; // Calculate the cell index
        markQueen(cellIdx);
      }
    }
  }
}

// Recursive utility function to solve the N-Queens problem
function solveNQueensUtil(board, colorCells, usedColors, col) {
  const size = board.length;

  if (usedColors.size === Object.keys(colorCells).length) return true;

  const colors = Object.keys(colorCells);

  for (let color of colors) {
    if (!usedColors.has(color)) {
      const cells = colorCells[color];
      for (let i = 0; i < cells.length; i++) {
        const [row, colIdx] = cells[i];
        if (isSafe(board, row, colIdx)) {
          board[row][colIdx] = true;
          usedColors.add(color);

          if (solveNQueensUtil(board, colorCells, usedColors, col + 1)) {
            return true;
          }

          board[row][colIdx] = false;
          usedColors.delete(color);
        }
      }
    }
  }

  return false;
}

// Function to solve the N-Queens problem
function solveNQueens() {
  const size = 9;
  let board = Array.from({ length: size }, () => Array(size).fill(false));

  const cells = document.querySelectorAll('div[data-cell-idx]');
  const colorCells = {};

  cells.forEach(cell => {
    const cellIdx = parseInt(cell.getAttribute('data-cell-idx'));
    const row = Math.floor(cellIdx / size);
    const col = cellIdx % size;
    const colorClass = Array.from(cell.classList).find(cls => cls.startsWith('cell-color-'));

    if (colorClass) {
      if (!colorCells[colorClass]) {
        colorCells[colorClass] = [];
      }
      colorCells[colorClass].push([row, col]);
    }
  });

  const usedColors = new Set();
  if (solveNQueensUtil(board, colorCells, usedColors, 0)) {
    placeCrowns(board);
    console.log("Queens placed successfully!");
  } else {
    console.log("No solution found.");
  }
}


solveNQueens();
