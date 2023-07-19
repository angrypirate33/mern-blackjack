
import './WagerInfo.css'

export default function WagerInfo() {
    return (
        <div className='WagerInfo'>
            <span id='curr-sign'>$</span>
            <input 
                type="number" 
                id='wager-amount'
                min='10'
                max='1000'
                step='10'
            />
            <button
                className='waves-effect waves-light btn red darken-4'
                id='place-bet-button'
            >
                Place Bet
            </button>
        </div>
    )
}