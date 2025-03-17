// Function to mark a cell as containing a crown (requires two clicks)
function markQueen(cellIdx) {
  const cell = document.querySelector(`div[data-cell-idx='${cellIdx}']`);
  if (!cell) return;

  const cellContent = cell.querySelector('.cell-content');
  if (!cellContent) return;

  // Simulate two clicks in a row (because the existing logic requires two clicks)
  if (typeof cellContent.click === 'function') {
    cellContent.click();
    cellContent.click();
  } else {
    const clickEvent = new Event('click', { bubbles: true, cancelable: true });
    cellContent.dispatchEvent(clickEvent);
    cellContent.dispatchEvent(clickEvent);
  }

  // Visual border (optional)
  cell.style.border = '2px solid red';
}

// Function to check if a queen can be placed on the board at (row, col)
function isSafe(board, row, col) {
  const size = board.length;

  // Check row and column
  for (let i = 0; i < size; i++) {
    if (board[row][i] || board[i][col]) {
      return false;
    }
  }

  // Check adjacent cells (diagonals directly next to the cell)
  const adjOffsets = [-1, 1];
  for (let dx of adjOffsets) {
    for (let dy of adjOffsets) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (
        newRow >= 0 &&
        newRow < size &&
        newCol >= 0 &&
        newCol < size &&
        board[newRow][newCol]
      ) {
        return false;
      }
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

// Recursive utility function to solve the N-Queens-like problem
function solveNQueensUtil(board, colorCells, usedColors, col) {
  const size = board.length;

  // If we've used all color groups, we're done
  if (usedColors.size === Object.keys(colorCells).length) {
    return true;
  }

  const colors = Object.keys(colorCells);

  for (let color of colors) {
    if (!usedColors.has(color)) {
      const cells = colorCells[color];
      for (let i = 0; i < cells.length; i++) {
        const [row, colIdx] = cells[i];
        if (isSafe(board, row, colIdx)) {
          board[row][colIdx] = true;
          usedColors.add(color);

          // Recurse
          if (solveNQueensUtil(board, colorCells, usedColors, col + 1)) {
            return true;
          }

          // Backtrack
          board[row][colIdx] = false;
          usedColors.delete(color);
        }
      }
    }
  }

  return false;
}

// Main function to solve the board and place the crowns
function solveNQueens() {
  // Grab all cells
  const cells = document.querySelectorAll('div[data-cell-idx]');
  if (!cells || cells.length === 0) {
    console.log("No cells found in the DOM.");
    return;
  }

  // Automatically determine the size by assuming a square (N x N)
  const totalCells = cells.length;
  const size = Math.sqrt(totalCells);

  if (!Number.isInteger(size)) {
    console.log("The total number of cells is not a perfect square. Cannot solve an N x N layout.");
    return;
  }

  // Build an NxN board representation
  let board = Array.from({ length: size }, () => Array(size).fill(false));

  // Organize cells by their color
  const colorCells = {};
  cells.forEach(cell => {
    const cellIdx = parseInt(cell.getAttribute('data-cell-idx'), 10);
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

  // Keep track of which colors have been used
  const usedColors = new Set();

  // Attempt to solve
  if (solveNQueensUtil(board, colorCells, usedColors, 0)) {
    placeCrowns(board);
    console.log("Queens placed successfully!");
  } else {
    console.log("No solution found.");
  }
}

// Finally, call solveNQueens
solveNQueens();
