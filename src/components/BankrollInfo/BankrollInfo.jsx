
import './BankrollInfo.css'

export default function BankrollInfo({ amount }) {
    return (
        <div className='BankrollInfo'>
            <h5>Bankroll: ${amount}</h5>
        </div>
    )
}