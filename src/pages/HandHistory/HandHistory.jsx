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
                <div col s12>
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


        </div>
    )
}