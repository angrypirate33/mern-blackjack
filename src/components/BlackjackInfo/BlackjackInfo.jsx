import { useState } from 'react'
import './BlackjackInfo.css'

export default function BlackjackInfo({ rulesVisible, setRulesVisible }) {

    const toggleRulesVisibility = () => {
        setRulesVisible(!rulesVisible)
    }

    return (
        <div className='BlackjackInfo'>
            <h1 id='pageTitle'>Blackjack - 21</h1>
            {rulesVisible && (
                <div id='hosueRules'>
                    <h3 id='rulesTitle'>House Rules:</h3>
                            <ul id='rulesDetail'>
                                <li>Min bet - $10 Max Bet - $1,000.</li>
                                <li>Ten deck shoe.</li>
                                <li>Dealer hits on 16 and stays on 17+.</li>
                                <li>Blackjack pays 3:2.</li>
                                <li>Number cards - face value, face cards - 10, Aces - 11</li>
                                <li>Splitting hands is not allowed at this time.</li>
                                <li>Insurance is not available.</li>
                            </ul>
                        </div>
                    )}
                    <button 
                        className='waves-effect waves-light btn green darken-4'
                        onClick={toggleRulesVisibility}>
                            {rulesVisible ? 'Hide Rules' : 'Show Rules'}
                    </button>
                </div>
    )
}