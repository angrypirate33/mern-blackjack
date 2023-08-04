import { useState } from 'react'
import './WagerInfo.css'

export default function WagerInfo({ storeAndDeal }) {

    const [wagerAmount, setWagerAmount] = useState(10)
    
    const handleChange = (event) => {
        setWagerAmount(event.target.value)
    }

    const handleClick = () => {
        storeAndDeal(wagerAmount)
    }

    return (
        <div className='WagerInfo'>
            <span id='curr-sign'>$</span>
            <input 
                type="number" 
                id='wager-amount'
                min='10'
                max='1000'
                step='10'
                value={wagerAmount}
                onChange={handleChange}
            />
            <button
                className='waves-effect waves-light btn red darken-4'
                id='place-bet-button'
                onClick={handleClick}
            >
                Place Bet
            </button>
        </div>
    )
}