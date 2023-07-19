import { buildOriginalDeck, getNewShuffledDeck } from '../../utilities/deck'
import BlackjackInfo from '../../components/BlackjackInfo/BlackjackInfo'
import Table from '../../components/Table/Table'
import '../../pages/BlackjackPage/BlackjackPage.css'

export default function BlackjackPage() {
    const originalDeck = buildOriginalDeck()
    const shuffledDeck = getNewShuffledDeck(originalDeck)


    return (
        <div className='BlackjackPage'>
            <BlackjackInfo />
            <Table />
        </div>
    )
}