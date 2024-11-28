import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GameBoard } from './components/GameBoard';
import { PauseMenu } from './components/PauseMenu';
import { GameOver } from './components/GameOver';
import { useGame } from './hooks/useGame';
import useSound from 'use-sound';

const StyledTetrisWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #000;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledTetris = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  margin: 0 auto;
`;

const StatsDisplay = styled.div`
  margin-top: 20px;
  text-align: center;
  
  h2 {
    margin: 10px 0;
    color: #fff;
  }
`;

function App() {
  const [isPaused, setIsPaused] = useState(false);
  const {
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
  } = useGame();

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.keyCode === 27) { // ESC
        setIsPaused(!isPaused);
      }
      if (!isPaused && !gameOver) {
        switch (event.keyCode) {
          case 37: // Left
            moveBlock('left');
            break;
          case 39: // Right
            moveBlock('right');
            break;
          case 40: // Down
            dropBlock();
            break;
          case 38: // Up
            rotateBlock();
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPaused, gameOver, moveBlock, rotateBlock, dropBlock]);

  const handleRestart = () => {
    resetGame();
    setIsPaused(false);
  };

  return (
    <StyledTetrisWrapper>
      <StyledTetris>
        <GameBoard 
          gameState={gameState} 
          currentPiece={currentPiece} 
          position={position}
        />
        {isPaused && !gameOver && (
          <PauseMenu
            score={score}
            level={level}
            lines={lines}
            onResume={() => setIsPaused(false)}
            onReset={handleRestart}
          />
        )}
        {gameOver && (
          <GameOver
            score={score}
            level={level}
            lines={lines}
            onRestart={handleRestart}
          />
        )}
        <StatsDisplay>
          <h2>Score: {score}</h2>
          <h2>Level: {level}</h2>
          <h2>Lines: {lines}</h2>
        </StatsDisplay>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
}

export default App;
