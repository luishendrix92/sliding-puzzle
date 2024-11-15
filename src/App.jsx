import { useEffect, useState } from "react";

import './App.css';
import { COLS, ROWS } from "./constants";
import Piece from "./Piece";
import { arePiecesInOrder, createMatrix } from "./puzzle";

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
