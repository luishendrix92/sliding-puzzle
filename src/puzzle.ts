import { LAST_PIECE } from "./constants";

/**
 * Whether or not a flattened puzzle matrix is sorted in ascending order.
 * Once a sliding puzzle has all its pieces in order, it's considered complete.
 * @param ids {Array<number>} Flat array set of piece IDs
 * @return {boolean}
 */
export function arePiecesInOrder(ids) {
  for (let i = 1; i < ids.length; i++) {
    if (ids[i] !== ids[i - 1] + 1) return false;
  }

  return true;
}

/**
 * Determines whether a particular permutation of a sliding puzzle (in the
 * form of a flat array) is solvable (the number of indirections is even).
 * @param {Array<number>} pieceSet Flat array set of piece IDs
 * @returns {boolean}
 */
export function isPuzzleSolvable(pieceSet) {
  let inversions = 0;

  for (let i = 0; i < pieceSet.length; i++) {
    for (let j = i + 1; j < pieceSet.length; j++) {
      if (pieceSet[i] > pieceSet[j]) inversions++;
    }
  }

  return inversions % 2 === 0;
}

/**
 * Attempts to make a piece slide. This function returns the new version of the
 * matrix after sliding the puzzle (immutable update).
 * @param {Array<Array<number>>} pieces Piece-ID matrix (state)
 * @param {number} row Row index of the clicked piece
 * @param {number} col Column index of the clicked piece
 * @returns {Array<Array<number>>}
 */
export function slidePiece(pieces, row, col) {
  const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]]; // Up, Right, Down, Left

  for (const [rowDelta, colDelta] of dirs) {
    const adjacentPieceId = pieces[row + rowDelta]?.[col + colDelta];

    if (adjacentPieceId === LAST_PIECE) {
      const clickedPieceId = pieces[row][col];

      return pieces.map((row) => row.map((pieceId) => {
        if (pieceId === clickedPieceId) return LAST_PIECE;
        else if (pieceId === LAST_PIECE) return clickedPieceId;

        return pieceId;
      }));
    }
  }

  return pieces;
}

/**
 * Returns the 2D array that represents the pieces in a sliding puzzle. The
 * puzzle is re-generated until random order and solvability is ensured.
 * @param {number} rows Number of rows in the puzzle
 * @param {number} cols Number of columns
 * @returns {number[][]}
 */
export function createMatrix(rows, cols) {
  const ids = Array(rows * cols - 1).fill(0)
    .map((_v, i) => i);

  do {
    // NOTE: I chose the Fisher-Yates algorithm to shuffle the piece IDs
    for (let i = rows * cols - 2; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
  } while (!isPuzzleSolvable(ids) || arePiecesInOrder(ids));

  ids.push(rows * cols - 1);

  return Array(rows).fill(0)
    .map((_v, i) => ids.slice(i * cols, i * cols + cols));
}
