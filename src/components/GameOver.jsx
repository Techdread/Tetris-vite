import React from 'react';
import styled from 'styled-components';

const StyledGameOver = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const GameOverContent = styled.div`
  background: #000;
  padding: 40px;
  border-radius: 20px;
  border: 2px solid #333;
  text-align: center;
  color: white;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  background: #333;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #444;
  }
`;

export const GameOver = ({ score, level, lines, onRestart }) => (
  <StyledGameOver>
    <GameOverContent>
      <h1>Game Over!</h1>
      <div>
        <h2>Final Score: {score}</h2>
        <h2>Level Reached: {level}</h2>
        <h2>Lines Cleared: {lines}</h2>
      </div>
      <Button onClick={onRestart}>Play Again</Button>
    </GameOverContent>
  </StyledGameOver>
);
