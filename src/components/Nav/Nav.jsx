import { Link } from 'react-router-dom'
import * as userService from '../../utilities/users-service'

export default function Nav({ user, setUser }) {
    function handleLogOut() {
        userService.logOut()
        setUser(null)
    }

    return (
        <nav className='green darken-4'>
            <div className='nav-wrapper'>
                <span>Welcome, {user.name}</span>
                <Link 
                    className='right' 
                    id='logout-btn'
                    to="" onClick={handleLogOut}
                >
                    Log Out
                    &nbsp;&nbsp;&nbsp;
                </Link>
            </div>
        </nav>
    )
}