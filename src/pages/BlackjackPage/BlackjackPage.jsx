import { useState, useEffect } from 'react'
import { buildOriginalDeck, getNewShuffledDeck } from '../../utilities/deck'
import BlackjackInfo from '../../components/BlackjackInfo/BlackjackInfo'
import Table from '../../components/Table/Table'
import '../../pages/BlackjackPage/BlackjackPage.css'

export default function BlackjackPage() {

    const [currWager, setCurrWager] = useState(0)
    const [bankAmt, setBankAmt] = useState(1500)
    const [playerCards, setPlayerCards] = useState(['sA','sK'])
    const [dealerCards, setDealerCards] = useState(['dA', 'd10'])
    const [rulesVisible, setRulesVisible] = useState(false)

    const originalDeck = buildOriginalDeck()
    const shuffledDeck = getNewShuffledDeck(originalDeck)


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
            />
        </div>
    )
}