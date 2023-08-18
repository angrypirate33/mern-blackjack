import { useState, useEffect, useReducer } from 'react'
import { buildOriginalDeck, getNewShuffledDeck, getBlackjackDeck } from '../../utilities/deck'
import BlackjackInfo from '../../components/BlackjackInfo/BlackjackInfo'
import Table from '../../components/Table/Table'
import MessageCenter from '../../components/MessageCenter/MessageCenter'
import '../../pages/BlackjackPage/BlackjackPage.css'

export default function BlackjackPage({ user }) {

    const [rulesVisible, setRulesVisible] = useState(false)
    const [dealerTurnInProgress, setDealerTurnInProgress] = useState(false)
    const [handActive, setHandActive] = useState(false)
    const [playerAction, setPlayerAction] = useState(false)
    const [updateDb, setUpdateDb] = useState(false)

    const BLACKJACK_SCORE = 21
    const DEALER_MIN_SCORE = 16

    const chipSound = new Audio('/sound/chips.mp3')
    const cardSound = new Audio('/sound/cardflip.mp3')

    const initialState = {
        bankState: { 
            bankAmt: user.name === 'Guest' ? 1000 : user.bankroll, 
            wager: 0
        },
        playerCards: [],
        dealerCards: [],
        dealerScore: null,
        playerScore: null,
        deck: [],
        dealerRevealed: false,
        dealerBlackjack: false,
        playerBlackjack: false,
        turn: 'player',
        message: 'Place Wager...',
        result: null
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
                    message: 'Deaing Cards...',
                    playerCards: [],
                    dealerCards: []
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
                    dealerScore: state.dealerBlackjack ? state.dealerScore : action.payload.dealerScore,
                    playerBlackjack: action.payload.playerBlackjack,
                    // dealerBlackjack: action.payload.dealerBlackjack
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
                    turn: newScore.total > BLACKJACK_SCORE ? 'dealer' : 'player'
                }
            case 'PLAYER_STAND':
                return {
                    ...state,
                    turn: 'dealer',
                    dealerRevealed: true
                }
            case 'UPDATE_DEALER_SCORE':
                return {
                    ...state,
                    dealerScore: action.payload
                }
            case 'DEALER_TURN':
                return {
                    ...state,
                    turn: 'dealer'
                }
            case 'DEALER_HIT':
                return {
                    ...state,
                    dealerCards: action.payload.dealerCards,
                    deck: action.payload.deck,
                    dealerScore: action.payload.dealerScore
                }
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
                    message: `Player hit blackjack and wins $${state.bankState.wager * 1.5}!`,
                    bankState: {
                        ...state.bankState,
                        bankAmt: state.bankState.bankAmt + (state.bankState.wager * 2.5)
                    },
                    result: 'win'
                }
            case 'DEALER_BLACKJACK':
                return {
                    ...state,
                    dealerRevealed: true,
                    dealerBlackjack: true,
                    dealerScore: { total: 21, aces: 1 },
                    message: `Dealer hit blackjack, player loses $${state.bankState.wager}.`,
                    turn: 'player',
                    result: 'loss'
                }
            case 'PUSH_BLACKJACK':
                return {
                    ...state,
                    message: `Both player and dealer hit blackjack, $${state.bankState.wager} has been returned to the player's bankroll.`,
                    bankState: {
                        ...state.bankState,
                        bankAmt: state.bankState.bankAmt + (state.bankState.wager * 1)
                    },
                    result: 'push'
                }
            case 'DEALER_BUSTS':
                return {
                    ...state,
                    message: `Dealer busts, player wins $${state.bankState.wager}!`,
                    bankState: {
                        ...state.bankState,
                        bankAmt: state.bankState.bankAmt + (state.bankState.wager * 2)
                    },
                    turn: 'player',
                    result: 'win'
                }
            case 'PLAYER_BUSTS':
                return {
                    ...state,
                    message: `Player busts and loses $${state.bankState.wager}.`,
                    result: 'loss'
                }
            case 'PUSH':
                return {
                    ...state,
                    message: `It's a push, $${state.bankState.wager} has been returned to the player's bankroll.`,
                    bankState: {
                        ...state.bankState,
                        bankAmt: state.bankState.bankAmt + state.bankState.wager
                    },
                    turn: 'player',
                    result: 'push'
                }
            case 'PLAYER_WINS':
                return {
                    ...state,
                    message: `Player wins $${state.bankState.wager}!`,
                    bankState: {
                        ...state.bankState,
                        bankAmt: state.bankState.bankAmt + (state.bankState.wager * 2)
                    },
                    turn: 'player',
                    result: 'win'
                }
            case 'DEALER_WINS':
                return {
                    ...state,
                    message: `Dealer wins, player loses $${state.bankState.wager}`,
                    turn: 'player',
                    result: 'loss'
                }
            case 'RESET_TABLE':
                return {
                    ...state,
                    playerCards: [],
                    dealerCards: [],
                    playerScore: null,
                    dealerScore: null,
                    dealerRevealed: false,
                    playerBlackjack: false,
                    dealerBlackjack: false,
                    turn: 'player',
                    bankState: { ...state.bankState, wager: 0 }
                }
            default:
                throw new Error(`Unhandled action type: ${action.type}`)
        }
    }

    const [state, dispatch] = useReducer(bjReducer, initialState)

    const { turn } = state

    useEffect(() => {
        const originalDeck = buildOriginalDeck()
        const shuffledDeck = getNewShuffledDeck(originalDeck)
        // const shuffledDeck = getBlackjackDeck(originalDeck)
        dispatch({ 
            type: 'SET_DECK', 
            payload: shuffledDeck
        })
    }, [])

    
    useEffect(() => {
        if (state.deck.length < 52 && !handActive) {
        const originalDeck = buildOriginalDeck()
        const shuffledDeck = getNewShuffledDeck(originalDeck)
        
        dispatch({ 
            type: 'SET_DECK', 
            payload: shuffledDeck
        })
        }
    }, [state.deck, handActive])

    useEffect(() => {
        if (updateDb) {
            updateBankrollInDb(user._id, state.bankState.bankAmt)
            addHandToDb()
            setUpdateDb(false)
        }
    }, [updateDb, user._id, state.bankState.bankAmt])

    useEffect(() => {
        if (state.playerScore && state.playerScore.total > BLACKJACK_SCORE) {
            dispatch({ 
                type: 'PLAYER_BUSTS'
            })
            setHandActive(false)
            setUpdateDb(true)
        }
    }, [state.playerScore])
    
    useEffect(() => {
        if (state.turn === 'dealer' && !dealerTurnInProgress) {
            setDealerTurnInProgress(true)
            dealerTurn()
        }
    }, [state.turn])
    
    function storeWager(wagerAmt) {
        dispatch({ type: 'STORE_WAGER', payload: wagerAmt })
    }

    async function dealCards() {

        setHandActive(true)
        
        dispatch({ type: 'DEAL_CARDS_START' })

        const deckCopy = [...state.deck]
        let pScore = { total: 0, aces: 0 }
        let dScore = { total: 0, aces: 0 }
        let dFullScore = { total: 0, aces: 0 }
        let updatedPlayerCards = []
        let updatedDealerCards = []

        for (let i = 0; i < 4; i++) {

            await new Promise(resolve => setTimeout(resolve, 1000))
            
            playCardSound()

            const card = deckCopy.shift()
            if (i % 2 === 0) {
                updatedPlayerCards.push(card)
                pScore = calculateScore(updatedPlayerCards, false, false)
                dispatch({ type: 'SET_PLAYER_CARDS', payload: { cards: updatedPlayerCards, score: pScore } })
            } else {
                updatedDealerCards.push(card)
                dFullScore = calculateScore(updatedDealerCards, true, true)
                let payload
                if (i === 3) {
                    dScore = calculateScore(updatedDealerCards, true, false)
                    const dealerUpcard = updatedDealerCards[1]

                    let cardPayload = {
                        cards: updatedDealerCards,
                        score: dScore
                    }

                    if ((dealerUpcard.value === 10 || dealerUpcard.face) && dFullScore.total === BLACKJACK_SCORE) {
                        cardPayload.revealed = true
                    } else {
                        cardPayload.revealed = false
                        cardPayload.message = "Player's Action..." 
                    }

                    dispatch({
                        type: 'SET_DEALER_CARDS',
                        payload: cardPayload
                    })

                    playCardSound()
                    
                    if (cardPayload.revealed) {
                        dispatch({ type: 'DEALER_BLACKJACK' })
                        setHandActive(false)
                        setUpdateDb(true)
                        setPlayerAction(false)
                        playCardSound()
                    }

                } else {
                    dispatch({
                        type: 'SET_DEALER_CARDS',
                        payload: {
                            cards: updatedDealerCards,
                            revealed: false,
                            message: 'Dealing Cards...'
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
                        playerBlackjack: pScore.total === BLACKJACK_SCORE, 
                        dealerBlackjack: dScore.total === BLACKJACK_SCORE 
                    }
                })
                
                if (pScore.total === BLACKJACK_SCORE && dFullScore.total !== BLACKJACK_SCORE) {
                    dispatch({ type: 'PLAYER_BLACKJACK' })
                    playChipSound()
                    setHandActive(false)
                    setUpdateDb(true)
                } else if (dFullScore.total === BLACKJACK_SCORE && pScore.total !== BLACKJACK_SCORE) {
                    setPlayerAction(false)
                    // dispatch({ type: 'DEALER_BLACKJACK' })
                    // dispatch({ type: 'UPDATE_DEALER_SCORE', score: BLACKJACK_SCORE })
                } else if (pScore.total === BLACKJACK_SCORE && dFullScore.total === BLACKJACK_SCORE) {
                    dispatch({ type: 'PUSH_BLACKJACK' })
                    playChipSound()
                    setHandActive(false)
                    setUpdateDb(true)
                } else {
                    setPlayerAction(true)
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

        while (score > BLACKJACK_SCORE && aces > 0) {
            score -= 10
            aces -= 1
        }
        return { total: score, aces: aces }
    }

    function playerHit() {
        dispatch({ type: 'PLAYER_HIT' })
        playCardSound()      
    }

    function playerStand() {
        if (state.turn === 'player') {
            dispatch({ type: 'PLAYER_STAND' })
            const newDealerScore = calculateScore(state.dealerCards, true, true)

            if (newDealerScore.total > DEALER_MIN_SCORE && newDealerScore.total <= BLACKJACK_SCORE && newDealerScore.total > state.playerScore.total) {
                dispatch({ type: 'UPDATE_DEALER_SCORE', payload: newDealerScore })
                dispatch({ type: 'DEALER_WINS' })
                setHandActive(false)
                setUpdateDb(true)
                setPlayerAction(false)
            } else {
                dispatch({ type: 'UPDATE_DEALER_SCORE', payload: newDealerScore })
                dispatch({ type: 'UPDATE_MESSAGE', payload: "Dealer's Action" })
            }
        }
    }

    async function dealerTurn() {
        try {
            if (state.turn === 'dealer' && !state.playerBlackjack && state.playerScore.total <= BLACKJACK_SCORE) {
                let score = state.dealerScore.total
                let currentState = state
                if (score > DEALER_MIN_SCORE && score < BLACKJACK_SCORE && score > state.playerScore.total) {
                    dispatch({ type: 'DEALER_WINS' })
                    setHandActive(false)
                    setUpdateDb(true)
                    setPlayerAction(false)
                    return
                }
                while (score <= DEALER_MIN_SCORE) {
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    const { newScore, newState } = dealerHit(currentState)
                    score = newScore.total
                    currentState = newState
                }
                if (score > BLACKJACK_SCORE) {
                    dispatch({ type: 'DEALER_BUSTS' })
                    playChipSound()
                    setHandActive(false)
                    setUpdateDb(true)
                    return
                } else {
                    if (score === state.playerScore.total) {
                        dispatch({ type: 'PUSH' })
                        setHandActive(false)
                        setUpdateDb(true)
                        setUpdateDb(true)
                        setPlayerAction(false)
                        return
                    } else if (score < state.playerScore.total) {
                        dispatch({ type: 'PLAYER_WINS' })
                        playChipSound()
                        setHandActive(false)
                        setUpdateDb(true)
                        setPlayerAction(false)
                        return
                    } else {
                        dispatch({ type: 'DEALER_WINS' })
                        setHandActive(false)
                        setUpdateDb(true)
                        setPlayerAction(false)
                        return
                    }
                }
            }
        } finally {
            setDealerTurnInProgress(false)
            setHandActive(false)
            setUpdateDb(true)
            setPlayerAction(false)
        }
    }

    function dealerHit(currentState) {
                const newCard = currentState.deck[0]
                const newDeck = currentState.deck.slice(1)
                const newDealerCards = [...currentState.dealerCards, newCard]
                const newScore = calculateScore(newDealerCards, true, true)

                playCardSound()

                dispatch({
                    type: 'DEALER_HIT',
                    payload: {
                        dealerCards: newDealerCards,
                        deck: newDeck,
                        dealerScore: newScore
                    }
                })

                return { newScore, newState: { ...currentState, dealerCards: newDealerCards, deck: newDeck, dealerScore: newScore } }
    }

    function updateBankrollInDb(userId, newBankroll) {
        fetch(`/api/bankrolls/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bankroll: newBankroll})
        })
        .then(response => response.json())
        .catch(error => {
            console.error('Error updating bankroll: ', error)
        })
    }

    function addHandToDb() {
        const testBody = {
            userId: user._id,
            dealerCards: state.dealerCards,
            playerCards: state.playerCards,
            result: state.result,
            wagerAmount: state.bankState.wager
        }
        console.log(testBody)
        fetch('api/hands/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: user._id,
                dealerCards: state.dealerCards,
                playerCards: state.playerCards,
                result: state.result,
                wagerAmount: state.bankState.wager
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from server: ', data)
        })
        .catch(error => {
            console.error('Error adding hand to database: ', error)
        })
    }

    function playChipSound() {
        chipSound.play()
    }

    function playCardSound() {
        cardSound.play()
    }

    return (
        <div className='BlackjackPage'>
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
                    handActive={handActive}
                    setHandActive={setHandActive}
                    turn={turn}
                    playerAction={playerAction}
                    playChipSound={playChipSound}
                />
        </div>
    )
}