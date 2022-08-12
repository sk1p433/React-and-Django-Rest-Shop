import { Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const ProtectedRoute = ({children}) => {
    let {LoginToken} = useContext(AuthContext)
    const {isAuthenticated} = useContext(AuthContext);

    return isAuthenticated ? children : <Navigate to="/login" />;
}


export default ProtectedRoute;
