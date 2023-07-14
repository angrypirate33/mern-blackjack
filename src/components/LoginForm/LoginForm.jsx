import { useState } from 'react'
import { login } from '../../utilities/users-service'

export default function LoginForm({ setUser }) {
    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const [error, setError] = useState('')

    function handleChange(evt) {
        setCredentials({ ...credentials, [evt.target.name]: evt.target.value })
        setError('')
    }

    async function handleSubmit(evt) {
        evt.preventDefault()

        try {
           const user = await login(credentials)
           setUser(user)
        }
        catch {
            setError('Login Failed - Try Again')
        }
    }

    return (
        <div>
            <div className="container">
                <div className='card green darken-4'>
                    <div className='card-content'>
                        <form autoComplete="off" onSubmit={handleSubmit}>
                            <label className='white-text'>Email</label>
                            <input className='white-text' type="email" name="email" value={credentials.email} onChange={handleChange} required />
                            <label className='white-text'>Password</label>
                            <input className='white-text' type="password" name="password" value={credentials.password} onChange={handleChange} required />
                            <button className='waves-effect waves-light btn-large red' type="submit">Log In</button>
                        </form>
                    </div>
                </div>
            </div>
            <p className="error-message">&nbsp;{error}</p>
        </div>
    );    
}