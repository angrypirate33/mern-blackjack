import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import AuthPage from '../AuthPage/AuthPage'
import BlackjackPage from '../BlackjackPage/BlackjackPage'
import Nav  from '../../components/Nav/Nav'
import { getUser } from '../../utilities/users-service'
import './App.css'
import HandHistory from '../HandHistory/HandHistory'


export default function App() {

  const [user, setUser] = useState(getUser())

  const handleSetUser = (userData) => {
    if (userData === 'GUEST') {
      setUser({ name: 'Guest', isGuest: true })
    } else {
      setUser(userData)
    }
  }

  return (
    <main className="App">
      {
        user ?  
        <>
          <Nav user={user} setUser={handleSetUser} />
          <Routes>
            <Route path='/' element={<BlackjackPage user={user} />} />
            <Route path='/history' element={<HandHistory user={user} />} />
          </Routes>
        </>
        : 
        <AuthPage setUser={handleSetUser} />
      }
    </main>
  )
}

