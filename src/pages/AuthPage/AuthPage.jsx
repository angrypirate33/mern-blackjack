import { useState } from 'react'
import SignUpForm from '../../components/SignUpForm/SignUpForm'
import LoginForm from '../../components/LoginForm/LoginForm'
import './AuthPage.css'

export default function AuthPage({ setUser }) {

    const [userPref, setUserPref] = useState('signup')

    function handlePref() {
      if ( userPref === 'signup' ) {
      setUserPref('login')
    } else {
      setUserPref('signup')
    }
  }

    const handleGuestPlay = () => {
      setUser('GUEST')
    }
  
    return (
      <div className='container AuthPage' id='login-container'>
        { userPref === 'signup' ? <LoginForm setUser={setUser} /> : <SignUpForm setUser={setUser} /> }
        <button
          className='waves-effect waves-light btn-large red'
          id='login-btn' 
          onClick={handlePref}
        >
          { userPref === 'login' ? 'Already a member? Log In' : 'Need an Account? Sign Up' }
        </button>
        <button
          className='waves-effect waves-light btn-large red'
          id='guest-button'
          onClick={handleGuestPlay}
        >
          Play as a Guest
        </button>
      </div>
    )
  }