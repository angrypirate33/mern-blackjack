
import './PlayerActions.css'

export default function PlayerActions({ hit, stand }) {
    return (
        <div className='PlayerActions'>
            <button
                className='waves-effect waves-light btn-large red darken-4'
                id='hit-button'
                onClick={hit}
            >
                Hit
            </button>
            <button
                className='waves-effect waves-light btn-large red darken-4'
                id='stand-button'
                onClick={stand}
            >
                Stand
            </button>
        </div>
    )
}