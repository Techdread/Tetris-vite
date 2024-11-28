import React from 'react';
import styled from 'styled-components';

const StyledGameBoard = styled.div`
  display: grid;
  grid-template-rows: repeat(20, 30px);
  grid-template-columns: repeat(10, 30px);
  grid-gap: 1px;
  border: 2px solid #333;
  background: #111;
  padding: 10px;
`;

const Cell = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 4px;
  background: ${props => props.color ? `rgb(${props.color})` : '#000'};
  border: ${props => (props.color ? '4px solid' : '1px solid')};
  border-color: ${props =>
    props.color
      ? `rgba(0,0,0,0.1) rgba(0,0,0,0.3) rgba(0,0,0,0.3) rgba(0,0,0,0.1)`
      : 'rgba(255,255,255,0.1)'};
`;

export const GameBoard = ({ gameState, currentPiece, position }) => {
  const renderBoard = () => {
    // Create a copy of the game state
    const board = gameState.map(row => [...row]);
    
    // Render current piece on board
    if (currentPiece && position) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const boardY = y + position.y;
            const boardX = x + position.x;
            if (boardY >= 0 && boardY < board.length && boardX >= 0 && boardX < board[0].length) {
              board[boardY][boardX] = currentPiece.color;
            }
          }
        });
      });
    }

    return board.map((row, y) =>
      row.map((cell, x) => (
        <Cell key={`${y}-${x}`} color={cell} />
      ))
    );
  };

  return (
    <StyledGameBoard>
      {renderBoard()}
    </StyledGameBoard>
  );
};
