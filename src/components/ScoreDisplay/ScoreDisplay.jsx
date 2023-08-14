
import './ScoreDisplay.css'

export default function ScoreDisplay({ title, score, className }) {
    return (
        <div className={`ScoreDisplay ${className}`}>
            <h4 id='title'>{title}</h4>
            <h4 id='score'>{score?.total}</h4>
        </div>

    )
}