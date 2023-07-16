import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import AuthPage from '../AuthPage/AuthPage'
import BlackjackPage from '../BlackjackPage/BlackjackPage'
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
            <Route path='/' element={<BlackjackPage />} />
          </Routes>
        </>
        : 
        <AuthPage setUser={setUser} />
      }
    </main>
  )
}

