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
        </div>
    )
}