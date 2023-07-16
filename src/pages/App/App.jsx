import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import NewOrderPage from '../NewOrderPage/NewOrderPage'
import AuthPage from '../AuthPage/AuthPage'
import OrderHistoryPage from '../OrderHistoryPage/OrderHistoryPage'
import Nav  from '../../components/Nav/Nav'
import { getUser } from '../../utilities/users-service'
import './App.css'


export default function App() {
  const [user, setUser] = useState(getUser())
  return (
    <main className="App">
      {
        user ?  
        <>
          <Nav user={user} setUser={setUser} />
          <Routes>
            <Route path='/orders/new' element={<NewOrderPage />} />
            <Route path='/orders' element={<OrderHistoryPage />} />
          </Routes>
        </>
        : 
        <AuthPage setUser={setUser} />
      }
    </main>
  )
}

