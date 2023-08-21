import { useState, useEffect } from 'react'
import './HandHistory.css'

export default function HandHistory({ user }) {

    const [handsData, setHandsData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [handsPerPage, setHandsPerPage] = useState(25)

    // Calculate starting and ending index of hands for current page
    const indexOfLastHand = currentPage * handsPerPage
    const indexOfFirstHand = indexOfLastHand - handsPerPage
    const currentHands = handsData.slice(indexOfFirstHand, indexOfLastHand)

    const totalPages = Math.ceil(handsData.length / handsPerPage)

    useEffect(() => {
        fetch(`api/hands/history?userId=${user._id}`)
            .then(res => res.json())
            .then(data => setHandsData(data))
            .catch(error => console.error(error))
    }, [user._id])

    return (
        <div className='HandHistory'>
            <h2 id='hand-history-title'>Hand History for {user.name}</h2>

            <div className='hands-per-page-container'>
                <div className='col s12'>
                    <h5>Hands per Page: </h5>
                </div>
                <div className='input-field col s12'>
                    <select onChange={(e) => setHandsPerPage(Number(e.target.value))} className='browser-default' id='hands-per-page-dropdown'>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={75}>75</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

            <div className='navigation-container'>
                <button
                    className='waves-effect waves-light btn red darken-4'
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous Page
                </button>
                <button
                    className='waves-effect waves-light btn red darken-4'
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next Page
                </button>
            </div>

            <table className='highlight centered responsive-table' id='history-table'>
                <thead id='table-head'>
                    <tr>
                        <th>Date/Time</th>
                        <th>Dealer's Cards</th>
                        <th>Dealer's Score</th>
                        <th>Player's Cards</th>
                        <th>Player's Score</th>
                        <th>Result</th>
                        <th>Wager</th>
                    </tr>
                </thead>
                <tbody>
                    {currentHands.map(hand => (
                        <tr>
                            <td id='history-date'>{new Date(hand.createdAt).toLocaleString()}</td>
                            <td>
                                {hand.dealerCards.map(card => (
                                    <span key={card.id} className={`Card ${card.face} history-card`}></span>
                                ))}
                            </td>
                            <td className='history-score'>{hand.dealerScore}</td>
                            <td>
                                {hand.playerCards.map(card => (
                                    <span key={card.id} className={`Card ${card.face} history-card`}></span>
                                    ))}
                            </td>
                            <td className='history-score'>{hand.playerScore}</td>
                            <td id='history-result'>{hand.result}</td>
                            <td id='history-wager'>${hand.wagerAmount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className='card-view'>
                {currentHands.map(hand => (
                    <div className='card grey darken-3'>
                        <div className='card-content white-text'>
                            <span className='card-title'>{new Date(hand.createdAt).toLocaleString()}</span>
                            <div className='hand-row'>
                                <span className='card-subtitle'>Dealer's Cards</span>
                            </div>
                            <div className='hand-row'>
                                    <div id='dealer-section'>
                                        {hand.dealerCards.map(card => (
                                            <span key={card.id} className={`Card ${card.face} history-card`}></span>
                                            ))}
                                    </div>
                            </div>
                            <div className='hand-row'>
                                <span className='history-score'>{hand.dealerScore}</span>
                            </div>
                            <div className='hand-row'>
                                <span className='card-subtitle'>Player's Cards</span>
                            </div>
                            <div className='hand-row'>
                                <div id='player-section'>
                                    {hand.playerCards.map(card => (
                                        <span key={card.id} className={`Card ${card.face} history-card`}></span>
                                        ))}
                                </div>
                            </div>
                            <div className='hand-row'>
                                <span className='history-score'>{hand.playerScore}</span>
                            </div>
                            <div className='hand-row'>
                                <span id='history-result'>{hand.result}</span>
                                <span id='history-wager'>${hand.wagerAmount}</span>
                            </div>
                        </div>

                    </div>

                ))}

            </div>
        </div>
    )
}