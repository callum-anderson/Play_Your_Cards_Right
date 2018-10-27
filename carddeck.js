const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
function createDeck() {
  const gameDeck = [];
  for (s of suits) {
    for (i=2; i<15; i++) {
      gameDeck.push({value: i, suit: s})
    }
  }
  return gameDeck;
}
