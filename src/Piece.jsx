import { COLS, IMAGE_URL, LAST_PIECE, PIECE_HEIGHT, PIECE_WIDTH, ROWS } from "./constants";
import { slidePiece } from "./puzzle";

/**
 * Returns a style object for a piece div that assigns the background image
 * and its corresponding vertical/horizontal offsets (positioning).
 * @param {string} img URL of the background image
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

export default function Piece({ row, col, id, setPieces, isPuzzleComplete }) {
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