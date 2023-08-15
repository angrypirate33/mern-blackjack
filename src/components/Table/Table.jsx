
import BankrollInfo from '../BankrollInfo/BankrollInfo'
import DealerCards from '../DealerCards/DealerCards'
import PlayerActions from '../PlayerActions/PlayerActions'
import PlayerCards from '../PlayerCards/PlayerCards'
import ScoreDisplay from '../ScoreDisplay/ScoreDisplay'
import WagerInfo from '../WagerInfo/WagerInfo'
import '../CardLibrary/css/cardstarter.min.css'
import './Table.css'

export default function Table({ 
    currWager,
    bankAmt,
    playerCards,
    dealerCards,
    playerScore,
    dealerScore,
    storeAndDeal,
    dealerRevealed,
    playerHit,
    playerStand,
    dispatch,
    handActive,
    setHandActive,
    turn,
    playerAction
}) {
    return (
        <div className='Table'>
            <div className='row'>
                <div className='col s12 m3'>
                    <ScoreDisplay
                        className='DealerScore'
                        title="Dealer's Score"
                        score={dealerScore}
                    />
                </div>
                <div className='col s12 m9'>
                    <DealerCards
                        cards={dealerCards}
                        dealerRevealed={dealerRevealed}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='col s12'>
                    <WagerInfo 
                        storeAndDeal={storeAndDeal}
                        dispatch={dispatch}
                        handActive={handActive}
                        setHandActive={setHandActive}
                    />
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
                        score={playerScore}
                    />
                </div>
                <div className='col s12 m9'>
                    <PlayerCards
                        cards={playerCards}
                        dispatch={dispatch}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='col s12'>
                    <PlayerActions 
                        hit={playerHit}
                        stand={playerStand}
                        dispatch={dispatch}
                        turn={turn}
                        playerAction={playerAction}
                    />
                </div>
            </div>
        </div>
    )
}