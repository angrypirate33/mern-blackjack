
import Card from '../../components/Card/Card'
import './PlayerCards.css'

export default function PlayerCards({ cardClassName }) {
    return (
        <div className='PlayerCards'>
            <h4>PlayerCards</h4>
            <Card cardClassName='sA' />
            <Card cardClassName='d10' />
            <Card cardClassName='c08' />
            <Card cardClassName='s07' />
        </div>
    )
}