
import BankrollInfo from '../BankrollInfo/BankrollInfo'
import DealerCards from '../DealerCards/DealerCards'
import PlayerActions from '../PlayerActions/PlayerActions'
import PlayerCards from '../PlayerCards/PlayerCards'
import ScoreDisplay from '../ScoreDisplay/ScoreDisplay'
import WagerInfo from '../WagerInfo/WagerInfo'
import '../CardLibrary/css/cardstarter.min.css'
import './Table.css'

export default function Table({ currWager, bankAmt, playerCards, dealerCards }) {
    return (
        <div className='Table'>
            <div className='row'>
                <div className='col s12 m3'>
                    <ScoreDisplay
                        className='DealerScore'
                        title="Dealer's Score"
                        score={16}
                    />
                </div>
                <div className='col s12 m9'>
                    <DealerCards
                        cards={dealerCards}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='col s12'>
                    <WagerInfo />
                </div>
            </div>
                <div className='row'>
                    <div className='col s12'>
                        <BankrollInfo 
                            amount={bankAmt}
                        />
                    </div>
                </div>
            <div className='row'>
                <div className='col s12 m3'>
                    <ScoreDisplay
                        className='PlayerScore'
                        title="Player's Score"
                        score={18}
                    />
                </div>
                <div className='col s12 m9'>
                    <PlayerCards
                        cards={playerCards}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='col s12'>
                    <PlayerActions />
                </div>
            </div>
        </div>
    )
}