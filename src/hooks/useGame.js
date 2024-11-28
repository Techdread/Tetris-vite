import { useState, useCallback, useEffect } from 'react';
import { TETROMINOS, randomTetromino } from '../utils/tetrominos';
import { STAGE_WIDTH, STAGE_HEIGHT } from '../utils/gameHelpers';

export const useGame = () => {
  const [gameState, setGameState] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [dropTime, setDropTime] = useState(1000);
  const [gameOver, setGameOver] = useState(false);

  // Create empty game board
  function createEmptyBoard() {
    return Array.from(Array(STAGE_HEIGHT), () =>
      Array(STAGE_WIDTH).fill(0)
    );
  }

  // Check collisions
  const checkCollision = useCallback((piece, pos) => {
    if (!piece) return false;
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          const newY = y + pos.y;
          const newX = x + pos.x;
          
          if (
            newY < 0 || 
            newY >= STAGE_HEIGHT ||
            newX < 0 || 
            newX >= STAGE_WIDTH ||
            gameState[newY][newX] !== 0
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, [gameState]);

  // Move block
  const moveBlock = useCallback((dir) => {
    if (!currentPiece || gameOver) return;
    
    const newPos = {
      x: position.x + (dir === 'left' ? -1 : 1),
      y: position.y
    };
    
    if (!checkCollision(currentPiece, newPos)) {
      setPosition(newPos);
    }
  }, [currentPiece, position, checkCollision, gameOver]);

  // Rotate block
  const rotateBlock = useCallback(() => {
    if (!currentPiece || gameOver) return;
    
    const rotatedShape = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[i]).reverse()
    );
    
    const rotatedPiece = {
      ...currentPiece,
      shape: rotatedShape
    };
    
    if (!checkCollision(rotatedPiece, position)) {
      setCurrentPiece(rotatedPiece);
    }
  }, [currentPiece, position, checkCollision, gameOver]);

  // Drop block
  const dropBlock = useCallback(() => {
    if (!currentPiece || gameOver) return;
    
    const newPos = { ...position, y: position.y + 1 };
    
    if (!checkCollision(currentPiece, newPos)) {
      setPosition(newPos);
      return;
    }

    // If we can't move down, check if game over
    if (position.y <= 1) {
      setGameOver(true);
      return;
    }

    // Merge piece with board
    const newBoard = [...gameState];
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const boardY = y + position.y;
          const boardX = x + position.x;
          if (boardY >= 0 && boardY < STAGE_HEIGHT) {
            newBoard[boardY][boardX] = currentPiece.color;
          }
        }
      });
    });
    
    // Check for completed lines
    let linesCleared = 0;
    for (let y = STAGE_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(STAGE_WIDTH).fill(0));
        linesCleared++;
        y++; // Check the same row again
      }
    }
    
    // Update score and level
    if (linesCleared > 0) {
      setScore(prev => prev + (linesCleared * 100 * level));
      setLines(prev => {
        const newLines = prev + linesCleared;
        if (newLines >= level * 10) {
          setLevel(l => l + 1);
          setDropTime(1000 / (level + 1) + 200);
        }
        return newLines;
      });
    }
    
    setGameState(newBoard);
    
    // Spawn new piece
    const newPiece = randomTetromino();
    const newPiecePosition = { 
      x: Math.floor(STAGE_WIDTH / 2) - Math.floor(newPiece.shape[0].length / 2), 
      y: 0 
    };

    // Check if the new piece can be placed
    if (checkCollision(newPiece, newPiecePosition)) {
      setGameOver(true);
    } else {
      setCurrentPiece(newPiece);
      setPosition(newPiecePosition);
    }
  }, [currentPiece, position, gameState, level, checkCollision, gameOver]);

  // Start game
  useEffect(() => {
    if (!currentPiece) {
      const newPiece = randomTetromino();
      setCurrentPiece(newPiece);
      setPosition({ 
        x: Math.floor(STAGE_WIDTH / 2) - Math.floor(newPiece.shape[0].length / 2), 
        y: 0 
      });
    }
    
    const interval = setInterval(() => {
      if (!gameOver) {
        dropBlock();
      }
    }, dropTime);
    
    return () => clearInterval(interval);
  }, [dropTime, gameOver, dropBlock]);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState(createEmptyBoard());
    const newPiece = randomTetromino();
    setCurrentPiece(newPiece);
    setPosition({ 
      x: Math.floor(STAGE_WIDTH / 2) - Math.floor(newPiece.shape[0].length / 2), 
      y: 0 
    });
    setScore(0);
    setLines(0);
    setLevel(1);
    setDropTime(1000);
    setGameOver(false);
  }, []);

  return {
    gameState,
    currentPiece,
    position,
    level,
    score,
    lines,
    gameOver,
    moveBlock,
    rotateBlock,
    dropBlock,
    resetGame,
  };
};
