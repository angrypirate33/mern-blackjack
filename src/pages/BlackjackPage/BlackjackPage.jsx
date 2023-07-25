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
            setBankAmt((prevBankAmt) => prevBankAmt - wagerAmt)
        }
    }

    useEffect(() => {
        async function dealerTurn() {
            if (turn === 'dealer' && playerScore.total < 21) {
                let score = dealerScore.total
                while (score <= 16) {
                            const newScore = dealerHit()
                            score = newScore.total
                }
                if (score > 21) {
                    setBankAmt((prevBankAmt) => prevBankAmt + currWager * 2)
                    setMessage(`Dealer busts, player wins $${currWager * 2}!`)
                } else {
                    if (score === playerScore.total) {
                        setBankAmt((prevBankAmt) => prevBankAmt + currWager)
                        setMessage(`Push, $${currWager} has been returned to the player's bankroll.`)
                    } else if (score < playerScore.total) {
                        setBankAmt((prevBankAmt) => prevBankAmt + currWager * 2)
                        setMessage(`Player wins $${currWager}!`)
                    } else {
                        setMessage(`Dealer wins, player loses $${currWager}.`)
                    }
                }
            }
        }
        dealerTurn()
    }, [turn, dealerScore, playerScore])

    async function dealCards() {
        return new Promise(resolve => {
            setMessage('Dealing Cards')
            const deckCopy = [...deck]
            let pScore = { total: 0, aces: 0 }
            let dScore = { total: 0, aces: 0 }
            let dFullScore = { total: 0, aces: 0 }

            for (let i = 0; i < 4; i++) {
                setTimeout(() => {
                    const card = deckCopy.shift()
                    if (i % 2 === 0) {
                        setPlayerCards((prevPlayerCards) => {
                            const updatedPlayerCards = [...prevPlayerCards, card]
                            pScore = calculateScore(updatedPlayerCards, false, false)
                            setPlayerScore(pScore)
                            return updatedPlayerCards
                        })
                    } else {
                        setDealerCards((prevDealerCards) => {
                            const updatedDealerCards = [...prevDealerCards, card]
                            dFullScore = calculateScore(updatedDealerCards, true, true)
                            if (i === 3) {
                                dScore = calculateScore(updatedDealerCards, true, false)
                                setDealerScore(dScore)
                                setMessage("Player's Action")
                            }
                            return updatedDealerCards
                        })     
                    }
                    setDeck([...deckCopy])

                    if (i === 3) {
                        resolve ({ playerScore: pScore, dealerScore: dScore })
                    }
                }, 1000 * (i + 1))
            }
        })
    }

    async function storeAndDeal(wagerAmt) {
        resetTable()
        storeWager(wagerAmt)
        const { playerScore, dealerScore } = await dealCards()

        if (playerScore?.total === 21 && dealerScore?.total !== 21) {
            setBankAmt((prevBankAmt) => prevBankAmt + (wagerAmt * 2.5))
            setMessage(`Player hit blackjack and wins $${wagerAmt * 2.5}!`)
            return
        }

        if (dealerScore?.total === 21 && playerScore?.total !== 21) {
            setMessage(`Dealer hit blackjack, player loses $${wagerAmt}.`)
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
        return { total: score, aces: aces }
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

        if (pScore.total > 21) {
            setTurn('dealer')
            setMessage('Player has busted, dealer wins.')
        }
    }

    function playerStand() {
        if (turn === 'player') {
            setTurn('dealer')
            setMessage("Dealer's Action")
            setDealerRevealed(true)
            setTimeout(dealerAction, 1000)
        }
    }

    function dealerHit() {
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