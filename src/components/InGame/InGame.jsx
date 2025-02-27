import React from 'react';
import useGameState from '../../hooks/useGameState';
import Card from './Card';
import './InGame.css';

export default function InGame() {
  const { 
    gameState, 
    handlePlayCard, 
    handleDrawCard, 
    skipTurn, 
    canSkip 
  } = useGameState();

  if (!gameState.players || gameState.players.length === 0) {
    return <div className="loading">Loading Game...</div>;
  }

  return (
    <div className="game-container">
      {/* Discard Pile */}
      <div className="discard-pile">
        {gameState.discardPile.slice(-1).map((card, i) => (
          <Card key={i} card={card} />
        ))}
      </div>

      {/* Bot Players */}
      <div className="players-circle">
        {gameState.players.slice(1).map((player, index) => (
          <div key={player.id} className="bot-player">
            {player.cards.map((_, i) => (
              <Card key={i} isHidden />
            ))}
          </div>
        ))}
      </div>

      {/* Human Player */}
      <div className="human-hand">
        {gameState.players[0].cards.map((card, i) => (
          <Card key={i} card={card} onClick={() => handlePlayCard(card)} />
        ))}
      </div>

      {/* Game Controls */}
      <div className="game-controls">
        <div className="timer">Time Left: {gameState.timer}s</div>
        <button 
          onClick={handleDrawCard}
          disabled={!gameState.players[gameState.currentPlayer]?.isHuman}
        >
          Draw Card
        </button>
        
        {canSkip && gameState.players[gameState.currentPlayer]?.isHuman && (
          <button 
            onClick={skipTurn}
            className="skip-button"
            style={{
              position: 'fixed',
              top: '80px',
              right: '20px',
              zIndex: 1000
            }}
          >
            Skip Turn
          </button>
        )}
      </div>
    </div>
  );
}