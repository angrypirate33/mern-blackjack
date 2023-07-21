import { useState, useEffect } from 'react'
import { buildOriginalDeck, getNewShuffledDeck } from '../../utilities/deck'
import BlackjackInfo from '../../components/BlackjackInfo/BlackjackInfo'
import Table from '../../components/Table/Table'
import MessageCenter from '../../components/MessageCenter/MessageCenter'
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
    const [message, setMessage] = useState('')

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

    useEffect(() => {
        async function dealerTurn() {
            if (turn === 'dealer') {
                while (dealerScore.total <=16) {
                    await new Promise((resolve) => {
                        setTimeout(() => {
                            dealerHit()
                            resolve()
                        }, 1000)
                    })
                }
                if (dealerScore.total > 21) {
                    setBankAmt(bankAmt + currWager * 2)
                } else {
                    if (dealerScore.total === playerScore) {
                        setBankAmt(bankAmt + currWager)
                    } else if (dealerScore.total < playerScore) {
                        setBankAmt(bankAmt + currWager * 2)
                    }
                }
            }
        }
        dealerTurn()
    }, [turn, dealerScore, playerScore, currWager, bankAmt, resetTable])

    async function dealCards() {
        setMessage('Dealing Cards')
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
                    if (i === 3) {
                        dScore = calculateScore(dCards, true, false)
                        setDealerScore(dScore)
                        setMessage("Player's Turn")
                    }
                    setDealerCards([...dCards])
                }
                setDeck([...deckCopy])
            }, 1000 * (i+1))
        }
    }

    async function storeAndDeal(wagerAmt) {
        resetTable()
        storeWager(wagerAmt)
        await dealCards()

        if (playerScore === 21 && dealerScore?.total !== 21) {
            setBankAmt(bankAmt + currWager * 2.5)
            return
        }

        if (dealerScore?.total === 21 && playerScore !== 21) {
            return
        }

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
        if (turn === 'dealer') {
            return
        }
        const deckCopy = [...deck]
        const pCards = [...playerCards]

        const card = deckCopy.shift()
        pCards.push(card)

        const pScore = calculateScore(pCards, false, false)

        setPlayerCards([...pCards])
        setPlayerScore(pScore)
        setDeck([...deckCopy])

        if (pScore > 21) {
            setTurn('dealer')
            setTimeout(dealerAction, 1000)
        }
    }

    function playerStand() {
        if (turn === 'player') {
            setTurn('dealer')
            setDealerRevealed(true)
            setTimeout(dealerAction, 1000)
        }
    }

    function dealerHit() {
        const deckCopy = [...deck]
        const dCards = [...dealerCards]

        const card = deckCopy.shift()
        dCards.push(card)

        const dScore = calculateScore(dCards, true, true)

        setDealerCards([...dCards])
        setDealerScore(dScore)
        setDeck([...deckCopy])
    }

    function dealerAction() {
        dealerHit()
    }

    function resetTable() {
        setPlayerCards([])
        setDealerCards([])
        setDealerScore(null)
        setPlayerScore(null)
        setDealerRevealed(false)
        setTurn('player')
        setCurrWager(0)
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
            <MessageCenter
                message={message}
            />
        </div>
    )
}