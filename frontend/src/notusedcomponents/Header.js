import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
    let {LoginToken, logoutUser} = useContext(AuthContext)
    return (
        <div>
            <Link to="/" >Profile</Link>
            <span> | </span>
            {LoginToken ? (
                 <p  onClick={logoutUser}>Logout</p>
            ): (
                <Link to="/login" >Login</Link>
            )}

            {LoginToken &&   <p>Hello {window.localStorage.getItem('LoginToken')}</p>}

        </div>
    )
}
