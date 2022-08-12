import { createContext, useState, useContext } from 'react';
import { useNavigate, } from 'react-router-dom';
import CartContext from '../cart/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';


const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {

    let {emptyCart} = useContext(CartContext);
    const navigate = useNavigate()

    let [LoginToken, setLoginToken] = useState(() => {
            const token = localStorage.getItem("LoginToken");
            return token !== null;
            });
    let   [loading, setLoading] = useState(true)
    const [ error, setError] = useState()

    const notifyLogin = () => toast.info
    ('Вы успешно авторизовались!'
    , {
    position: "top-right",
    transition: Slide,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    limit: 1,
    });

    const notifyRegister = () => toast.info
    ('Вы успешно зарегистрировались!'
    , {
    position: "top-right",
    transition: Slide,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    limit: 1,
    });

    const notifyLogout = () => toast.info
    ('Вы вышли из вашего аккаунта'
    , {
    position: "top-right",
    transition: Slide,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    limit: 1,
    });

    const notifySuccesPurchase = () => toast.info
    ('Вы успешно оплатили покупку'
    , {
    position: "top-right",
    transition: Slide,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    limit: 1,
    });


    const registerUser = e => {
      e.preventDefault()
      if (e.target.password1.value !== e.target.password2.value) {
               alert("Пароли не совпадают") } else {
      fetch(
        'http://127.0.0.1:8000/api/v1/dj-rest-auth/registration/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        body:JSON.stringify({'username':e.target.username.value, 'password1':e.target.password1.value, 'password2':e.target.password2.value})
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw Error(`Something went wrong: code ${response.status}`)
        }
      })
      .then(({key}) => {
        setLoginToken(key)
        window.localStorage.setItem('LoginToken', key)
        window.localStorage.setItem('username', e.target.username.value)
        emptyCart()
        console.log(localStorage)
        navigate(-1)
        notifyRegister()
        setError(null)
       })
       .catch(error => {
         console.log(error)
         setError('Ошибка, подробности в консоли')
       })
      .finally(setLoading(false))
     } 
    }
       

    const loginUser = e => {
      e.preventDefault()
      setLoading(true);
      fetch(
        'http://127.0.0.1:8000/api/login/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        body:JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          alert(`Пользователь не существует`)
          //throw Error(`Something went wrong: code ${response.status}`)
        }
      })
      .then(({key}) => {
        setLoginToken(key)
        window.localStorage.setItem('LoginToken', key)
        window.localStorage.setItem('username', e.target.username.value)
        emptyCart()
        console.log(localStorage)
        navigate(-1)
        if (window.location.pathname === '/register') {
          navigate('/')
        }  
        notifyLogin()
        setError(null)
      })
       .catch(error => {
         console.log(error)
         setError('Ошибка, подробности в консоли')
      })
      .finally(setLoading(false))
    }


    const logoutUser = () =>{
      setLoginToken(null)
      localStorage.removeItem('LoginToken')
      localStorage.removeItem('username')
      emptyCart()
      notifyLogout()
      if (window.location.pathname === '/profile') {
        navigate('/')
      } 
    }

   
    const contextData = {
      registerUser:registerUser,
      loginUser:loginUser,
      logoutUser:logoutUser,
      notifySuccesPurchase:notifySuccesPurchase,
    }

    
      
    return(
      <AuthContext.Provider value={contextData} >
        {children} 
        <ToastContainer 
        limit={1}
        autoClose={5000}
        theme="light"
        /> 
      </AuthContext.Provider>
    )
}
