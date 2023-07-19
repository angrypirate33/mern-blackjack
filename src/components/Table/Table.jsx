
import BankrollInfo from '../BankrollInfo/BankrollInfo'
import DealerCards from '../DealerCards/DealerCards'
import PlayerActions from '../PlayerActions/PlayerActions'
import PlayerCards from '../PlayerCards/PlayerCards'
import ScoreDisplay from '../ScoreDisplay/ScoreDisplay'
import WagerInfo from '../WagerInfo/WagerInfo'
import './Table.css'

export default function Table() {
    return (
        <div className='Table'>
            <div className='row'>
                <ScoreDisplay
                    className='DealerScore'
                    title="Dealer's Score"
                    score={16}
                />
                <DealerCards />
            </div>
            <div className='row'>
                <WagerInfo />
            </div>
            <div className='row'>
                <ScoreDisplay 
                    className='PlayerScore'
                    title="Player's Score"
                    score={18}
                />
                <PlayerCards />
            </div>
            <div className='row'>
                <PlayerActions />
            </div>
        </div>
    )
}