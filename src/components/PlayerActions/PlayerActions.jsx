
import '../../components/PlayerActions/PlayerActions.css'

export default function PlayerActions() {
    return (
        <div className='PlayerActions'>
            <button
                className='waves-effect waves-light btn-large red darken-4'
                id='hit-button'
            >
                Hit
            </button>
            <button
                className='waves-effect waves-light btn-large red darken-4'
                id='stand-button'
            >
                Stand
            </button>
        </div>
    )
}