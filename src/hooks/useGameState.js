import { useState, useEffect, useCallback } from 'react';
import { createDeck, shuffle, checkValidMove, drawFromDeck } from '../utils/gameLogic';

export default function useGameState(playerCount = 4) {
  // Main game state
  const [gameState, setGameState] = useState({
    deck: [],
    discardPile: [],
    players: [],
    currentPlayer: 0,
    playDirection: 1,
    currentColor: null,
    timer: 20,
    status: 'waiting',
    playerCount
  });
  
  // UI state
  const [canSkip, setCanSkip] = useState(false);

  // 1. Game Initialization
  useEffect(() => {
    const initializeGame = () => {
      const newDeck = shuffle(createDeck());
      const players = Array.from({ length: playerCount }, (_, i) => ({
        id: i,
        cards: newDeck.splice(0, 7),
        isHuman: i === 0
      }));
      
      const initialDiscard = newDeck.pop();
      
      setGameState(prev => ({
        ...prev,
        deck: newDeck,
        discardPile: [initialDiscard],
        players,
        currentColor: initialDiscard.color,
        status: 'playing'
      }));
    };

    initializeGame();
  }, [playerCount]);

  // 2. Bot Turn Handler (Core Logic)
  useEffect(() => {
    const handleBotTurn = async () => {
      if (gameState.status !== 'playing') return;
      if (gameState.players[gameState.currentPlayer]?.isHuman) return;

      await new Promise(resolve => setTimeout(resolve, 1500)); // Bot "thinking" time

      setGameState(prev => {
        const bot = prev.players[prev.currentPlayer];
        if (!bot?.cards) return prev;

        const topCard = prev.discardPile[prev.discardPile.length - 1];
        const playableCards = bot.cards.filter(card => 
          checkValidMove(card, topCard, prev.currentColor)
        );

        // Bot plays card if possible
        if (playableCards.length > 0) {
          const randomCard = playableCards[Math.floor(Math.random() * playableCards.length)];
          return {
            ...prev,
            players: prev.players.map(player => 
              player.id === prev.currentPlayer
                ? { ...player, cards: player.cards.filter(c => c !== randomCard) }
                : player
            ),
            discardPile: [...prev.discardPile, randomCard],
            currentColor: randomCard.color === 'wild' ? getRandomColor() : randomCard.color,
            currentPlayer: (prev.currentPlayer + 1) % prev.playerCount
          };
        } 
        // Bot draws card if no playable cards
        else {
          const [drawnCards, newDeck] = drawFromDeck(prev.deck, 1, prev.discardPile);
          return {
            ...prev,
            deck: newDeck,
            players: prev.players.map(player => 
              player.id === prev.currentPlayer
                ? { ...player, cards: [...player.cards, ...drawnCards] }
                : player
            ),
            currentPlayer: (prev.currentPlayer + 1) % prev.playerCount
          };
        }
      });
    };

    if (gameState.status === 'playing' && 
        !gameState.players[gameState.currentPlayer]?.isHuman) {
      handleBotTurn();
    }
  }, [gameState.currentPlayer, gameState.status, gameState.players]);

  // 3. Human Player Timer
  useEffect(() => {
    let interval;
    if (gameState.status === 'playing' && 
        gameState.players[gameState.currentPlayer]?.isHuman) {
      interval = setInterval(() => {
        setGameState(prev => {
          if (prev.timer <= 1) {
            handleForceDraw();
            return { ...prev, timer: 20 };
          }
          return { ...prev, timer: prev.timer - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.status, gameState.currentPlayer]);

  // 4. Card Play Handler
  const handlePlayCard = useCallback((card) => {
    if (!gameState.players[gameState.currentPlayer]?.isHuman) return;

    setGameState(prev => {
      const topCard = prev.discardPile[prev.discardPile.length - 1];
      if (!checkValidMove(card, topCard, prev.currentColor)) return prev;

      return {
        ...prev,
        players: prev.players.map(player => 
          player.id === prev.currentPlayer
            ? { ...player, cards: player.cards.filter(c => c !== card) }
            : player
        ),
        discardPile: [...prev.discardPile, card],
        currentColor: card.color === 'wild' ? getRandomColor() : card.color,
        currentPlayer: (prev.currentPlayer + 1) % prev.playerCount,
        timer: 20
      };
    });
  }, [gameState.currentPlayer, gameState.players]);

  // 5. Draw Card Handler
  const handleDrawCard = useCallback(() => {
    setCanSkip(true);
    const [drawnCards, newDeck] = drawFromDeck(gameState.deck, 1, gameState.discardPile);
    setGameState(prev => ({
      ...prev,
      deck: newDeck,
      players: prev.players.map((player, index) => 
        index === 0 ? { ...player, cards: [...player.cards, ...drawnCards] } : player
      )
    }));
  }, [gameState.deck, gameState.discardPile]);

  // 6. Skip Turn Handler
  const skipTurn = useCallback(() => {
    setCanSkip(false);
    setGameState(prev => ({
      ...prev,
      currentPlayer: (prev.currentPlayer + 1) % prev.playerCount,
      timer: 20
    }));
  }, [playerCount]);

  // Helper Functions
  const getRandomColor = () => {
    const colors = ['red', 'blue', 'green', 'yellow'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleForceDraw = () => {
    handleDrawCard();
    skipTurn();
  };

  return {
    gameState,
    handlePlayCard,
    handleDrawCard,
    skipTurn,
    canSkip
  };
}