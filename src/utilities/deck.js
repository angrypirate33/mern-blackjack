
const suits = ['s', 'c', 'd', 'h']
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A']
const NUM_DECKS = 10

export function buildOriginalDeck() {
    const deck = []
    for (let deckNum = 1; deckNum <= NUM_DECKS; deckNum++) {
        suits.forEach(function(suit) {
            ranks.forEach(function(rank) {
                deck.push({
                    id: `${suit}${rank}${deckNum}`,
                    face: `${suit}${rank}`,
                    value: Number(rank) || (rank === 'A' ? 11 : 10)
                })
            })
        })
    }
    return deck;
}

export function getNewShuffledDeck(originalDeck) {
    const tempDeck = [...originalDeck]
    const newShuffledDeck = []
    while (tempDeck.length) {
      const rndIdx = Math.floor(Math.random() * tempDeck.length)
      newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0])
    }
    return newShuffledDeck
}

export function getBlackjackDeck(originalDeck) {
    const blackjackCards = [
        {face: 'hA', value: 11}, 
        {face: 'cA', value: 11}, 
        {face: 'hK', value: 10}, 
        {face: 'c10', value: 10}
    ]
    const tempDeck = [...originalDeck]

    const newShuffledDeck = [...blackjackCards]
    
    while (tempDeck.length) {
        const rndIdx = Math.floor(Math.random() * tempDeck.length)
        newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]) 
    }
    return newShuffledDeck
}