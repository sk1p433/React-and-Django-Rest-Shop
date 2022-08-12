import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import Form from 'react-bootstrap/Form';
import Button from '@mui/material/Button';
import Card from 'react-bootstrap/Card';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    let {loginUser} = useContext(AuthContext)

    const navigate = useNavigate()


    return (
     <div className="row justify-content-center"> 
      <Card style={{ width: '20rem', margin:10 }}>
       <Card.Header style={{textAlign: 'center'}}>
       <AccountCircleRoundedIcon fontSize='large' style={{float:'left', marginLeft:10, marginTop:5}} />
       <h4 style={{fontFamily: 'sans-serif', marginRight:25, marginTop:5 }}>Авторизация</h4>
       </Card.Header>
        <Form onSubmit={loginUser} style={{margin:10}}>
          <Form.Group className="mb-3">
             <Form.Control type="text" name="username" placeholder="Введите ваш ник" style={{width: '18rem', margin:5}} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control type="password" name="password" placeholder="Введите пароль" style={{width: '18rem', margin:5}}/>
            
          </Form.Group>
          <div className="row justify-content-center"> 
            <Button variant="contained" type="submit" style={{fontFamily: 'sans-serif', margin:5, width: '70%'}}>
             Войти
            </Button>
          </div>
          <Form.Text className="text-muted" style={{ margin: 5 }}>
          Если вы ещё не зарегистрированы, то вы можете пройти регистрацию
          </Form.Text>
          <div className="row justify-content-center">
            <Button variant="contained" type="submit" 
            style={{fontFamily: 'sans-serif', margin:5, width: '70%'}}
            onClick={()=> navigate('/register')}>
            Зарегистрироваться
            </Button>
          </div>
        </Form>
      </Card> 
     </div> 
    )
}

export default LoginPage
