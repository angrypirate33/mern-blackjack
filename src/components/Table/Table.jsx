
import BankrollInfo from '../BankrollInfo/BankrollInfo'
import DealerCards from '../DealerCards/DealerCards'
import PlayerActions from '../PlayerActions/PlayerActions'
import PlayerCards from '../PlayerCards/PlayerCards'
import ScoreDisplay from '../ScoreDisplay/ScoreDisplay'
import WagerInfo from '../WagerInfo/WagerInfo'
import '../CardLibrary/css/cardstarter.min.css'
import './Table.css'

export default function Table({ state, dispatch }) {
    return (
        <div className='Table'>
            <div className='row'>
                <div className='col s12 m3'>
                    <ScoreDisplay
                        className='DealerScore'
                        title="Dealer's Score"
                        score={state.dealerScore?.total}
                    />
                </div>
                <div className='col s12 m9'>
                    <DealerCards
                        cards={state.dealerCards}
                        dealerRevealed={state.dealerRevealed}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='col s12'>
                    <WagerInfo 
                        dispatch={dispatch}
                    />
                </div>
            </div>
                <div className='row'>
                    <div className='col s12'>
                        <BankrollInfo 
                            amount={state.bankState.bankAmt}
                        />
                    </div>
                </div>
            <div className='row'>
                <div className='col s12 m3'>
                    <ScoreDisplay
                        className='PlayerScore'
                        title="Player's Score"
                        score={state.playerScore?.total}
                    />
                </div>
                <div className='col s12 m9'>
                    <PlayerCards
                        cards={state.playerCards}
                        dispatch={dispatch}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='col s12'>
                    <PlayerActions 
                        dispatch={dispatch}
                    />
                </div>
            </div>
        </div>
    )
}