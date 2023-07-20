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

    const originalDeck = buildOriginalDeck()
    const shuffledDeck = getNewShuffledDeck(originalDeck)


    return (
        <div className='BlackjackPage'>
            <BlackjackInfo />
            <Table 
                currWager={currWager}
                bankAmt={bankAmt}
                playerCards={playerCards} 
                dealerCards={dealerCards}
            />
        </div>
    )
}