import {useState} from "react";

import './App.css'
import camel from './assets/camel.jpg'

const PIECE_WIDTH = 200;
const PIECE_HEIGHT = PIECE_WIDTH;
const ROWS = 3;
const COLS = 3;
const LAST_PIECE = ROWS * COLS - 1;

/**
 * Returns a style object for a piece div that assigns the background image
 * and its corresponding background offsets (positioning).
 * @param {number} id The piece's original ID (0-based)
 */
function pieceBgStyles(id) {
  const row = Math.floor(id / 3);
  const col = id % 3;

  return {
    backgroundImage: `url(${camel})`,
    backgroundSize: `${COLS * PIECE_WIDTH}px ${ROWS * PIECE_HEIGHT}px`,
    backgroundPosition: `-${col * PIECE_WIDTH}px -${row * PIECE_HEIGHT}px`,
  };
}

/**
 * Returns the 2D array that represents pieces in a sliding puzzle.
 * The ordering of the numbers from 0 to `rows * cols - 1` is random.
 * @param rows {number} Number of rows in the puzzle
 * @param cols {number} Number of columns
 * @returns {number[][]}
 */
function createMatrix(rows, cols) {
  const ids = Array(rows * cols - 1).fill(0)
    .map((_v, i) => i);

  // NOTE: I chose the Fisher-Yates algorithm to shuffle the piece IDs
  for (let i = rows * cols - 2; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [ids[i], ids[j]] = [ids[j], ids[i]];
  }

  ids.push(rows * cols - 1);

  return Array(rows).fill(0)
    .map((_v, i) =>
      ids.slice(i * cols, i * cols + cols)
    );
}

function Piece({ row, col, id, slidePiece }) {
  const isLastPiece = id === LAST_PIECE;
  const pieceStyle = {
    width: `${PIECE_WIDTH}px`,
    height: `${PIECE_HEIGHT}px`,
    ...(isLastPiece
      ? { cursor: "default" }
      : pieceBgStyles(id))
  };

  const slidePieceHandler = () => {
    if (!isLastPiece) slidePiece(row, col, id);
  };

  return (
    <div
      onClick={slidePieceHandler}
      className="piece"
      style={pieceStyle}
    >
      {!isLastPiece && id + 1}
    </div>
  );
}

function Puzzle() {
  const [pieces, setPieces] = useState(createMatrix(ROWS, COLS));

  /**
   * Attempts to make a piece slide. Once the pieces are ordered (ascending),
   * then the state of the puzzle will change to completed.
   * @param row {number} Row index of the clicked piece
   * @param col {number} Column index of the clicked piece
   */
  const slidePiece = (row, col) => {
    const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]]; // Up, Right, Down, Left

    for (const [rowDelta, colDelta] of dirs) {
      const adjacentPieceId = pieces[row + rowDelta]?.[col + colDelta] ?? -1;

      if (adjacentPieceId === LAST_PIECE) {
        const clickedPieceId = pieces[row][col];

        setPieces((pieces) =>
          pieces.map((row, rowIndex) =>
            row.map((pieceId, colIndex) => {
              if (pieceId === clickedPieceId) return LAST_PIECE;
              else if (pieceId === LAST_PIECE) return clickedPieceId;

              return pieceId;
            })
          ));
        break;
      }
    }
  }

  return (
    <div className="puzzle">
      {pieces.map((row, rowIndex) =>
        <div className="puzzle-row" key={rowIndex}>
          {row.map((pieceId, colIndex) =>
            <Piece
              slidePiece={slidePiece}
              key={colIndex}
              row={rowIndex}
              col={colIndex}
              id={pieceId}
            />
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="container">
      <Puzzle/>
      <button>Huh?</button>
    </div>
  )
}

export default App
