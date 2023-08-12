import Card from '../../components/Card/Card'
import '../CardLibrary/css/cardstarter.min.css'
import './DealerCards.css'

function DealerCards({ cards, dealerRevealed }) {
    return (
        <div className='DealerCards'>
            <h4>Dealer's Cards</h4>
            {
                cards.map((card, index) => {
                    const isFaceDown = index === 0 && !dealerRevealed
                    const className = isFaceDown ? 'back-red' : card.face
                    return (
                        <Card 
                            key={card.id} 
                            card={card} 
                            cardClassName={className} 
                        />
                    )
                })
            }
        </div>
    )
}

DealerCards.defaultProps = {
    cards: []
}

export default DealerCards