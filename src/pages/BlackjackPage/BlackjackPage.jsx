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
    const [turn, setTurn] = useState('player')

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
        let pScore = { total: 0, aces: 0 }
        let dScore = { total: 0, aces: 0 }
        let dFullScore = { total: 0, aces: 0 }

        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                const card = deckCopy.shift()
                if (i % 2 === 0) {
                    pCards.push(card)
                    pScore = calculateScore(pCards, false, false)
                    setPlayerCards([...pCards])
                    setPlayerScore(pScore)
                } else {
                    dCards.push(card)
                    dFullScore = calculateScore(dCards, true, true)
                    dScore = calculateScore(dCards, true, false)
                    setDealerCards([...dCards])
                    setDealerScore(dScore)
                }
                setDeck([...deckCopy])
            }, 1000 * (i+1))
        }
    }

    function storeAndDeal(wagerAmt) {
        storeWager(wagerAmt)
        dealCards()
    }

    function calculateScore(cards, isDealer, dealerRevealed) {
        let score = 0
        let aces = 0

        for (let i = 0; i < cards.length; i++) {
            if (isDealer && i === 0 && !dealerRevealed) {
                continue
            }
            let card = cards[i]
            if (card.value === 11) {
                aces += 1
            }
            score += card.value
        }

        while (score > 21 && aces > 0) {
            score -= 10
            aces -= 1
        }
        return score
    }

    function revealDealer() {
        setDealerRevealed(true)
        setDealerScore(calculateScore(dealerCards, true, true))
    }

    function playerHit() {
        const deckCopy = [...deck]
        const pCards = [...playerCards]

        const card = deckCopy.shift()
        pCards.push(card)

        const pScore = calculateScore(pCards, false, false)

        setPlayerCards([...pCards])
        setPlayerScore(pScore)
        setDeck([...deckCopy])

        if (pScore.total > 21) {
            setTurn('dealer')
        }
    }

    function playerStand() {
        setTurn('dealer')
    }

    function dealerAction() {
        if (turn !== 'dealer') {
            return
        }

        const drawCard = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const deckCopy = [...deck]
                    const dCards = [...dealerCards]
                    
                    const card = deckCopy.shift()
                    dCards.push(card)

                    const dScore = calculateScore(dCards, true, true)

                    setDealerCards([...dCards])
                    setDealerScore(dScore)
                    setDeck([...deckCopy])

                    resolve(dScore)
                }, 1000)
            })
        }

        const drawUntil17 = async () => {
            let dScore = calculateScore(dealerCards, true, true)

             while (dScore.total <= 16) {
                dScore = await drawCard()
             }

             if (dScore.total > 21) {
                 
             }
        }

        drawUntil17()
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
                playerHit={playerHit}
                playerStand={playerStand}
            />
        </div>
    )
}