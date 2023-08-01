
import './ScoreDisplay.css'

export default function ScoreDisplay({ title, score, className }) {
    return (
        <div className={`ScoreDisplay ${className}`}>
            <h4>{title}</h4>
            <h4>{score?.total}</h4>
        </div>

    )
}