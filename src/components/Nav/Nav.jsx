import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as userService from '../../utilities/users-service'
import '../../components/Nav/Nav.css'

export default function Nav({ user, setUser }) {

    const [sidenavInstance, setSidenavInstance] = useState(null)

    function handleLogOut() {
        userService.logOut()
        setUser(null)
    }

    function closeSidenav() {
        if (sidenavInstance) {
            sidenavInstance.close()
        }
    }

    useEffect(() => {
        let elems = document.querySelectorAll('.sidenav')
        let instances = window.M.Sidenav.init(elems, {})
        setSidenavInstance(instances[0])
    }, [])

    return (
        <div className='Nav'>
            <nav className='green darken-4'>
                <div className='nav-wrapper'>
                    <a href='#' data-target='sidenav-links' className='sidenav-trigger left'><i className='material-icons'>menu</i></a>
                    <span id='welcome-message'>Welcome, {user.name}</span>&nbsp;&nbsp;&nbsp;
                    <ul className='hide-on-med-and-down nav-links'>
                        <li><Link to='/' > Play Blackjack </Link></li>
                        <li>
                            {!user.isGuest && (
                                <Link to='/history' > View Hand History </Link>
                            )}
                        </li>
                    </ul>
                    <Link
                        className='hide-on-med-and-down'
                        id='logout-btn'
                        to='' onClick={handleLogOut}
                    >
                        <span id='logout'>Log Out</span>
                    </Link>
                </div>
            </nav>
        </div>

    )
}