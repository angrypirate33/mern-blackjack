
import './PlayerActions.css'

export default function PlayerActions({ hit, stand, turn, playerAction }) {

    const isDisabled = turn !== 'player' || playerAction !== true

    return (
        <div className='PlayerActions'>
            <button
                className='waves-effect waves-light btn-large red darken-4'
                id='hit-button'
                onClick={hit}
                disabled={isDisabled}
                >
                Hit
            </button>
            <button
                className='waves-effect waves-light btn-large red darken-4'
                id='stand-button'
                onClick={stand}
                disabled={isDisabled}
            >
                Stand
            </button>
        </div>
    )
}