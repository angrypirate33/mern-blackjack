
import BankrollInfo from '../BankrollInfo/BankrollInfo'
import DealerCards from '../DealerCards/DealerCards'
import PlayerActions from '../PlayerActions/PlayerActions'
import PlayerCards from '../PlayerCards/PlayerCards'
import ScoreDisplay from '../ScoreDisplay/ScoreDisplay'
import WagerInfo from '../WagerInfo/WagerInfo'
import '../../components/Table/Table.css'

export default function Table() {
    return (
        <div className='Table'>
            <ScoreDisplay />
            <DealerCards />
            <WagerInfo />
            <ScoreDisplay />
            <PlayerCards />
            <PlayerActions />
        </div>
    )
}