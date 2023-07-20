
import Card from '../../components/Card/Card'
import './PlayerCards.css'

export default function PlayerCards({ cardClassName, cards }) {
    return (
        <div className='PlayerCards'>
            <h4>Player's Cards</h4>
            {cards.map((card, index) => <Card key={index} card={card} cardClassName={card.face} />)}
        </div>
    )
}