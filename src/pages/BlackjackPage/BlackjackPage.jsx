import { useState, useEffect, useReducer, useContext } from 'react'
import { buildOriginalDeck, getNewShuffledDeck } from '../../utilities/deck'
import BlackjackInfo from '../../components/BlackjackInfo/BlackjackInfo'
import { BlackjackContext } from '../../utilities/BlackjackContext'
import Table from '../../components/Table/Table'
import MessageCenter from '../../components/MessageCenter/MessageCenter'
import '../../pages/BlackjackPage/BlackjackPage.css'

export default function BlackjackPage() {

    const [rulesVisible, setRulesVisible] = useState(false)

    const initialState = {
        bankState: { bankAmt: 1000, wager: 0},
        playerCards: [],
        dealerCards: [],
        rulesVisible: false,
        dealerScore: null,
        playerScore: null,
        deck: [],
        dealerRevealed: false,
        turn: 'player',
        message: ''
    }

    function bjReducer(state, action) {
        switch (action.type) {
            case 'SET_DECK':
                return {
                    ...state,
                    deck: action.payload
                }
            case 'STORE_WAGER':
                const wagerAmt = action.payload
                if (wagerAmt <= state.bankState.bankAmt) {
                    return {
                        ...state,
                        bankState: {
                            ...state.bankState,
                            wager: wagerAmt,
                            bankAmt: state.bankState.bankAmt - wagerAmt
                        }
                    }
                } else {
                    return state
                }
            case 'DEAL_CARDS_START':
                return {
                    ...state,
                    message: 'Deaing Cards...'
                } 
            case 'SET_PLAYER_CARDS':
                return {
                    ...state,
                    playerCards: action.payload.cards,
                    playerScore: action.payload.score
                }
            case 'SET_DEALER_CARDS':
                return {
                    ...state,
                    dealerCards: action.payload.cards,
                    dealerScore: action.payload.score,
                    dealerRevealed: action.payload.revealed,
                    message: action.payload.message
                }
            case 'DEAL_CARDS_SUCCESS':
                return {
                    ...state,
                    playerScore: action.payload.playerScore,
                    dealerScore: action.payload.dealerScore,
                    playerBlackjack: action.payload.playerBlackjack,
                    dealerBlackjack: action.payload.dealerBlackjack
                }
            case 'PLAYER_HIT':
                const newCard = state.deck[0]
                const newDeck = state.deck.slice(1)
                const newPlayerCards = [...state.playerCards, newCard]
                const newScore = calculateScore(newPlayerCards, false, false)
                return {
                    ...state,
                    playerCards: newPlayerCards,
                    deck: newDeck,
                    playerScore: newScore,
                    turn: newScore.total > 21 ? 'dealer' : 'player'
                }
            case 'PLAYER_STAND':
                return {
                    ...state,
                    turn: 'dealer',
                    dealerRevealed: true
                }
            case 'DEALER_TURN':
                //
            case 'DEALER_HIT':
                return {
                    ...state,
                    dealerCards: action.payload.dealerCards,
                    deck: action.payload.deck,
                    dealerScore: action.payload.dealerScore
                }
            case 'DEALER_STAND':
                //
            case 'CALCULATE_SCORE':
                //
            case 'UPDATE_MESSAGE':
                return {
                    ...state,
                    message: action.payload
                }
            case 'UPDATE_BANK_STATE':
                return {
                    ...state,
                    bankState: action.payload
                }
            case 'PLAYER_BLACKJACK':
                return {
                    ...state,
                    message: `Player hit blackjack and wins $${state.bankState.wager} * 1.5!`,
                    bankState: {
                        ...state.bankState,
                        bankAmt: state.bankState.bankAmt + (state.bankState.wager * 2.5)
                    }
                }
            case 'DEALER_BLACKJACK':
                return {
                    ...state,
                    message: `Dealer hit blackjack, player loses $${state.bankState.wager}.`
                }
            case 'PUSH_BLACKJACK':
                return {
                    ...state,
                    message: `Both player and dealer hit blackjack, $${state.bankState.wager} has been returned to the player's bankroll.`,
                    bankState: {
                        ...state.bankState,
                        bankAmt: state.bankState.bankAmt + state.bankState.wager
                    }
                }
            case 'DEALER_BUSTS':
                return {
                    ...state,
                    message: `Dealer busts, player wins $${state.bankState.wager}`,
                    bankState: {
                        ...state.bankState,
                        bankAmt: state.bankState.bankAmt + (state.bankState.wager * 2)
                    }
                }
            case 'PUSH':
                return {
                    ...state,
                    message: `It's a push, $${state.bankState.wager} has been returned to the player's bankroll.`,
                    bankState: {
                        ...state.bankState,
                        bankAmt: state.bankState.bankAmt + state.bankState.wager
                    }
                }
            case 'PLAYER_WINS':
                return {
                    ...state,
                    message: `Player wins $${state.bankState.wager}!`,
                    bankState: {
                        ...state.bankState,
                        bankAmt: state.bankState.bankAmt + (state.bankState.wager * 2)
                    }
                }
            case 'DEALER_WINS':
                return {
                    ...state,
                    message: `Dealer wins, player loses $${state.bankState.wager}`
                }
            case 'RESET_TABLE':
                return {
                    ...state,
                    playerCards: [],
                    dealerCards: [],
                    playerScore: null,
                    dealerScore: null,
                    dealerRevealed: false,
                    turn: 'player',
                    bankState: { ...state.bankState, wager: 0 }
                }
            default:
                throw new Error(`Unhandled action type: ${action.type}`)
        }
    }

    const [state, dispatch] = useReducer(bjReducer, initialState)

    useEffect(() => {
        const originalDeck = buildOriginalDeck()
        const shuffledDeck = getNewShuffledDeck(originalDeck)
        dispatch({ type: 'SET_DECK', payload: shuffledDeck })
    }, [])

    function storeWager(wagerAmt) {
        dispatch({ type: 'STORE_WAGER', payload: wagerAmt })
    }

    useEffect(() => {
        async function dealerTurn() {
            if (state.turn === 'dealer' && state.playerScore.total < 21) {
                let score = state.dealerScore.total
                while (score <= 16) {
                    const newScore = await dealerHit()
                    score = newScore.total
                }
                if (score > 21) {
                    dispatch({ type: 'DEALER_BUSTS' })
                } else {
                    if (score === state.playerScore.total) {
                        dispatch({ type: 'PUSH' })
                    } else if (score < state.playerScore.total) {
                        dispatch({ type: 'PLAYER_WINS' })
                    } else {
                        dispatch({ type: 'DEALER_WINS' })
                    }
                }
            }
        }
        dealerTurn()
    }, [state.turn, state.dealerScore, state.playerScore])

    async function dealCards() {
        
        dispatch({ type: 'DEAL_CARDS_START' })

        const deckCopy = [...state.deck]
        let pScore = { total: 0, aces: 0 }
        let dScore = { total: 0, aces: 0 }
        let dFullScore = { total: 0, aces: 0 }
        let updatedPlayerCards = [...state.playerCards]
        let updatedDealerCards = [...state.dealerCards]

        for (let i = 0; i < 4; i++) {

            await new Promise(resolve => setTimeout(resolve, 1000))

            const card = deckCopy.shift()
            if (i % 2 === 0) {
                updatedPlayerCards.push(card)
                pScore = calculateScore(updatedPlayerCards, false, false)
                dispatch({ type: 'SET_PLAYER_CARDS', payload: { cards: updatedPlayerCards, score: pScore } })
            } else {
                updatedDealerCards.push(card)
                dFullScore = calculateScore(updatedDealerCards, true, true)
                if (i === 3) {
                    dScore = calculateScore(updatedDealerCards, true, false)
                    const dealerUpcard = updatedDealerCards[1]
                    if ((dealerUpcard.value === 10 || dealerUpcard.face) && dFullScore.total === 21) {
                        dispatch({ 
                            type: 'SET_DEALER_CARDS', 
                            payload: { 
                                cards: updatedDealerCards, 
                                score: dScore, 
                                revealed: true, 
                                message: `Dealer hit blackjack, player loses $${state.bankState.wager}`
                            }
                        })
                    } else {
                        dispatch({ 
                            type: 'SET_DEALER_CARDS', 
                            payload: { 
                                cards: updatedDealerCards, 
                                score: dScore, 
                                revealed: false, 
                                message: "Player's Action" 
                            }
                        })
                    }
                } else {
                    dispatch({
                        type: 'SET_DEALER_CARDS',
                        payload: {
                            cards: updatedDealerCards,
                            score: dScore,
                            revealed: false
                        }
                    })
                }   
            }
            
            dispatch({ type: 'SET_DECK', payload: deckCopy })

            if (i === 3) {
                dispatch({ 
                    type: 'DEAL_CARDS_SUCCESS', 
                    payload: { 
                        playerScore: pScore, 
                        dealerScore: dScore, 
                        playerBlackjack: pScore.total === 21, 
                        dealerBlackjack: dScore.total === 21 
                    }
                })
                if (pScore.total === 21 && dScore.total !== 21) {
                    dispatch({ type: 'PLAYER_BLACKJACK' })
                } else if (dScore.total === 21 && pScore.total !== 21) {
                    dispatch({ type: 'DEALER_BLACKJACK' })
                } else if (pScore.total === 21 && dScore.total === 21) {
                    dispatch({ type: 'PUSH_BLACKJACK' })
                }
            }
        }
    }
    

    function storeAndDeal(wagerAmt) {
        dispatch({ type: 'RESET_TABLE' })
        dispatch({ type: 'STORE_WAGER', payload: wagerAmt })
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
        return { total: score, aces: aces }
    }

    function playerHit() {
        const newCard = state.deck[0]
        const newDeck = state.deck.slice(1)
        const newPlayerCards = [...state.playerCards, newCard]
        const newScore = calculateScore(newPlayerCards, false, false)
        const message = newScore.total > 21 ? 'Player has busted, dealer wins.' : "Player's Action"
        
        dispatch({ 
            type: 'PLAYER_HIT',
            payload: {
                playerCards: newPlayerCards,
                deck: newDeck,
                playerScore: newScore,
                message: message
            }
        })       
    }

    function playerStand() {
        if (state.turn === 'player') {
            dispatch({ type: 'PLAYER_STAND' })
            dispatch({ type: 'UPDATE_MESSAGE', payload: "Dealer's Action" })
            setTimeout(() => dispatch({ type: 'DEALER_TURN' }), 1000)
        }
    }

    function dealerHit() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const newCard = state.deck[0]
                const newDeck = state.deck.slice(1)
                const newDealerCards = [...state.dealerCards, newCard]
                const newScore = calculateScore(newDealerCards, true, true)

                dispatch({
                    type: 'DEALER_HIT',
                    payload: {
                        dealerCards: newDealerCards,
                        deck: newDeck,
                        dealerScore: newScore
                    }
                })

                resolve(newScore)

            }, 1000)
        })
    }

    function resetTable() {
        dispatch({ type: 'RESET_TABLE' })
    }

    return (
        <div className='BlackjackPage'>
            <BlackjackContext.Provider value={{state, dispatch}}>
                <BlackjackInfo
                    rulesVisible={rulesVisible}
                    setRulesVisible={setRulesVisible}
                />
                <MessageCenter
                    message={state.message}
                />
                <Table
                    currWager={state.bankState.wager}
                    bankAmt={state.bankState.bankAmt}
                    playerCards={state.playerCards}
                    dealerCards={state.dealerCards}
                    dealerScore={state.dealerScore}
                    playerScore={state.playerScore}
                    storeAndDeal={storeAndDeal}
                    dealerRevealed={state.dealerRevealed}
                    playerHit={playerHit}
                    playerStand={playerStand}
                    dispatch={dispatch}
                />
            </BlackjackContext.Provider>
        </div>
    )
}