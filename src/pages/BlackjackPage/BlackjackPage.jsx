import BlackjackInfo from '../../components/BlackjackInfo/BlackjackInfo'
import Table from '../../components/Table/Table'
import '../../pages/BlackjackPage/BlackjackPage.css'

export default function BlackjackPage() {

    

    return (
        <div className='BlackjackPage'>
            <BlackjackInfo />
            <Table />
        </div>
    )
}