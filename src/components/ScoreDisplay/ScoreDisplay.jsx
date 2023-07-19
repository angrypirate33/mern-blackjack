
import '../../components/ScoreDisplay/ScoreDisplay.css'

export default function ScoreDisplay({ title, dealerScore }) {
    return (
        <div className='ScoreDisplay'>
            <h4>{title}</h4>
            <h4>{dealerScore}</h4>
        </div>

    )
}