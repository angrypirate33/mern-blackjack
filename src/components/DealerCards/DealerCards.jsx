import Card from '../../components/Card/Card'
import '../CardLibrary/css/cardstarter.min.css'
import './DealerCards.css'

function DealerCards({ cardClassName, cards, dealerRevealed }) {
    return (
        <div className='DealerCards'>
            <h4>Dealer's Cards</h4>
            {
                cards.map((card, index) => {
                    return (
                        <Card 
                            key={index} 
                            card={card} 
                            cardClassName={index === 0 && !dealerRevealed ? 'back-red' : card.face} 
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