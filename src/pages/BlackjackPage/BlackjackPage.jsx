import { useState, useEffect } from 'react'
import { buildOriginalDeck, getNewShuffledDeck } from '../../utilities/deck'
import BlackjackInfo from '../../components/BlackjackInfo/BlackjackInfo'
import Table from '../../components/Table/Table'
import '../../pages/BlackjackPage/BlackjackPage.css'

export default function BlackjackPage() {

    const [currWager, setCurrWager] = useState(0)
    const [bankAmt, setBankAmt] = useState(1000)
    const [playerCards, setPlayerCards] = useState([])
    const [dealerCards, setDealerCards] = useState([])
    const [rulesVisible, setRulesVisible] = useState(false)
    const [dealerScore, setDealerScore] = useState(null)
    const [playerScore, setPlayerScore] = useState(null)
    const [deck, setDeck] = useState([])
    const [dealerRevealed, setDealerRevealed] = useState(false)

    useEffect(() => {
        const originalDeck = buildOriginalDeck()
        const shuffledDeck = getNewShuffledDeck(originalDeck)
        setDeck(shuffledDeck)
    }, [])

    function storeWager(wagerAmt) {
        if (wagerAmt <= bankAmt) {
            setCurrWager(wagerAmt)
            setBankAmt(bankAmt - wagerAmt)
        }
    }

    async function dealCards() {
        const deckCopy = [...deck]
        const pCards = [...playerCards]
        const dCards = [...dealerCards]

        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                const card = deckCopy.shift()
                if (i % 2 === 0) {
                    pCards.push(card)
                    setPlayerCards([...pCards])
                } else {
                    dCards.push(card)
                    setDealerCards([...dCards])
                }
                setDeck([...deckCopy])
            }, 1000 * (i+1))
        }
    }

    function storeAndDeal(wagerAmt) {
        storeWager(wagerAmt)
        dealCards()
    }

    function calculateScore(cards, dealerRevealed) {
        let score = 0
        let aces = 0

        for (let i = 0; i < cards.length; i++) {
            if (i === 0 && !dealerRevealed) {
                continue
            }
            let card = cards[i]
            score += card.value
            if (card.value === 11) {
                aces += 1
            }
        }
        return score
    }

    function revealDealer() {
        setDealerRevealed(true)
        setDealerScore(calculateScore(dealerCards))
    }

    return (
        <div className='BlackjackPage'>
            <BlackjackInfo 
                rulesVisible={rulesVisible}
                setRulesVisible={setRulesVisible}
            />
            <Table 
                currWager={currWager}
                bankAmt={bankAmt}
                playerCards={playerCards} 
                dealerCards={dealerCards}
                dealerScore={dealerScore}
                setDealerScore={setDealerScore}
                playerScore={playerScore}
                setPlayerScore={setPlayerScore}
                storeAndDeal={storeAndDeal}
                dealerRevealed={dealerRevealed}
            />
        </div>
    )
}