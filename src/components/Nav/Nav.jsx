import { Link } from 'react-router-dom'
import * as userService from '../../utilities/users-service'
import '../../components/Nav/Nav.css'

export default function Nav({ user, setUser }) {
    function handleLogOut() {
        userService.logOut()
        setUser(null)
    }

    return (
        <nav className='green darken-4'>
            <div className='nav-wrapper'>
                <span id='welcome-message'>Welcome, {user.name}</span>
                <Link 
                    className='right' 
                    id='logout-btn'
                    to="" onClick={handleLogOut}
                    >
                    <span id='logout'>Log Out</span>
                </Link>
            </div>
        </nav>
    )
}