
import Card from '../../components/Card/Card'
import './PlayerCards.css'

export default function PlayerCards({ cardClassName, cards }) {
    return (
        <div className='PlayerCards'>
            <h4 className='card-title'>Player's Cards</h4>
            <div className='dealt-cards'>
                {cards.map((card) => <Card key={card.id} card={card} cardClassName={card.face} />)}
            </div>
        </div>
    )
}