import Card from '../../components/Card/Card'
import '../CardLibrary/css/cardstarter.min.css'
import './DealerCards.css'

export default function DealerCards() {
    return (
        <div className='DealerCards'>
            <h4>DealerCards</h4>
            <Card cardClassName='sA' />
            <Card cardClassName='d10' />
            <Card cardClassName='c08' />
            <Card cardClassName='s07' />
        </div>
    )
}