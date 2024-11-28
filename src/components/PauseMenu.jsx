import React from 'react';
import styled from 'styled-components';

const StyledPauseMenu = styled.div`
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

const MenuContent = styled.div`
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

export const PauseMenu = ({ score, level, lines, onResume, onReset }) => (
  <StyledPauseMenu>
    <MenuContent>
      <h1>Game Paused</h1>
      <div>
        <h2>Score: {score}</h2>
        <h2>Level: {level}</h2>
        <h2>Lines: {lines}</h2>
      </div>
      <div>
        <Button onClick={onResume}>Resume</Button>
        <Button onClick={onReset}>New Game</Button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Controls</h3>
        <p>← → : Move</p>
        <p>↑ : Rotate</p>
        <p>↓ : Drop</p>
        <p>ESC : Pause</p>
      </div>
    </MenuContent>
  </StyledPauseMenu>
);
