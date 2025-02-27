export const createDeck = () => {
    const colors = ['red', 'blue', 'green', 'yellow'];
    const numbers = Array.from({ length: 10 }, (_, i) => i);
    const specials = ['skip', 'reverse', 'draw-two'];
    const wilds = ['wild', 'wild-draw-four'];
    
    const deck = [];
    
    // Number cards
    colors.forEach(color => {
      numbers.forEach(number => {
        deck.push({ color, value: number, type: 'number' });
        if (number !== 0) deck.push({ color, value: number, type: 'number' });
      });
    });
  
    // Special cards
    colors.forEach(color => {
      specials.forEach(special => {
        deck.push({ color, value: special, type: 'special' });
        deck.push({ color, value: special, type: 'special' });
      });
    });
  
    // Wild cards
    wilds.forEach(wild => {
      for (let i = 0; i < 4; i++) {
        deck.push({ color: 'wild', value: wild, type: 'wild' });
      }
    });
  
    return deck;
  };
  
  export const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  
// Update checkValidMove in gameLogic.js
export const checkValidMove = (card, topCard, currentColor) => {
  if (!card || !topCard) return false; // Add null checks
  return card.color === currentColor ||
         card.color === topCard.color ||
         card.value === topCard.value ||
         card.type === 'wild';
};
  
  export const drawFromDeck = (deck, count, discardPile) => {
    let newDeck = [...deck];
    const drawn = [];
    
    while (drawn.length < count) {
      if (newDeck.length === 0) {
        newDeck = shuffle([...discardPile.slice(0, -1)]);
      }
      drawn.push(newDeck.shift());
    }
    
    return [drawn, newDeck];
  };