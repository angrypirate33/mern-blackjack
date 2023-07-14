import './OrderHistoryPage.css'
import { checkToken } from '../../utilities/users-service'

export default function OrderHistoryPage() {

  async function handleCheckToken() {
    const expDate = await checkToken()
  }
  
  return (
    <div>
      <h1>OrderHistoryPage</h1>
      <button onClick={handleCheckToken}>Check When My Login Expires</button>
    </div>
  )
  }