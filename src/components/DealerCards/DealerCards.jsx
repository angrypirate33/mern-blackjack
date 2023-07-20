import Card from '../../components/Card/Card'
import '../CardLibrary/css/cardstarter.min.css'
import './DealerCards.css'

export default function DealerCards({ cardClassName, cards }) {
    return (
        <div className='DealerCards'>
            <h4>Dealer's Cards</h4>
            {cards.map(card => <Card card={card} cardClassName={card} />)}
        </div>
    )
}