import {useEffect, useState} from "react";

import './App.css'

const PIECE_WIDTH = 200;
const PIECE_HEIGHT = PIECE_WIDTH;
const ROWS = 3;
const COLS = 3;
const LAST_PIECE = ROWS * COLS - 1;
const IMAGE_URL = `https://picsum.photos/${PIECE_WIDTH * COLS}/${PIECE_HEIGHT * ROWS}`;

/**
 * Whether or not a flattened puzzle matrix is sorted in ascending order.
 * Once a sliding puzzle has all its pieces in order, it's considered complete.
 * @param ids {Array<number>} Flat array set of piece IDs
 * @return {boolean}
 */
function arePiecesInOrder(ids) {
  for (let i = 1; i < ids.length; i++) {
    if (ids[i] !== ids[i - 1] + 1) return false;
  }

  return true;
}

/**
 * Returns a style object for a piece div that assigns the background image
 * and its corresponding vertical/horizontal offsets (positioning).
 * @param {{}} img URL of the background image
 * @param {number} id The piece's original ID (0-based)
 */
function pieceBgStyles(img, id) {
  const row = Math.floor(id / COLS);
  const col = id % COLS;

  return {
    backgroundImage: `url(${img})`,
    backgroundSize: `${COLS * PIECE_WIDTH}px ${ROWS * PIECE_HEIGHT}px`,
    backgroundPosition: `-${col * PIECE_WIDTH}px -${row * PIECE_HEIGHT}px`,
  };
}

/**
 * Determines whether a particular permutation of a sliding puzzle (in the
 * form of a flat array) is solvable (the number of indirections is even).
 * @param pieceSet {Array<number>} Flat array set of piece IDs
 * @returns {boolean}
 */
function isPuzzleSolvable(pieceSet) {
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
 * @param pieces {Array<Array<number>>} Piece-ID matrix (state)
 * @param row {number} Row index of the clicked piece
 * @param col {number} Column index of the clicked piece
 * @returns {Array<Array<number>>}
 */
function slidePiece(pieces, row, col) {
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
 * @param rows {number} Number of rows in the puzzle
 * @param cols {number} Number of columns
 * @returns {number[][]}
 */
function createMatrix(rows, cols) {
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

function Piece({ row, col, id, setPieces, isPuzzleComplete }) {
  const isSlideable = id !== LAST_PIECE && !isPuzzleComplete;
  const isRevealed = id !== LAST_PIECE || isPuzzleComplete;
  const pieceStyle = {
    width: `${PIECE_WIDTH}px`,
    height: `${PIECE_HEIGHT}px`,
    ...(isRevealed ? pieceBgStyles(IMAGE_URL, id) : {})
  };

  const slidePieceHandler = () => {
    if (isSlideable) {
      setPieces((pieces) => slidePiece(pieces, row, col));
    }
  };

  return (
    <div
      onClick={slidePieceHandler}
      className={`piece ${isSlideable ? "pointer" : ""}`}
      style={pieceStyle}
    >
      {isRevealed && id + 1}
    </div>
  );
}

function App() {
  const [pieces, setPieces] = useState(createMatrix(ROWS, COLS));
  const [isComplete, setIsComplete] = useState(false);
  const gridStyles = {
    gridTemplateRows: `repeat(${ROWS}, 1fr)`,
    gridTemplateColumns: `repeat(${COLS}, 1fr)`
  };

  useEffect(() => {
    if (arePiecesInOrder(pieces.flat())) {
      setIsComplete(true);
    }
  }, [pieces]);

  const reshuffle = () => {
    setPieces(createMatrix(ROWS, COLS));
    setIsComplete(false);
  };

  return (
    <>
      <div className="puzzle" style={gridStyles}>
        {pieces.flatMap((row, rowIndex) =>
          row.map((pieceId, colIndex) =>
            <Piece
              isPuzzleComplete={isComplete}
              setPieces={setPieces}
              key={pieceId}
              row={rowIndex}
              col={colIndex}
              id={pieceId}
            />
          )
        )}
      </div>
      <button onClick={() => reshuffle()}>
        Reshuffle
      </button>
    </>
  );
}

export default App
