import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import Form from 'react-bootstrap/Form';
import Button from '@mui/material/Button';
import Card from 'react-bootstrap/Card';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';

const RegisterPage = () => {
    let {registerUser} = useContext(AuthContext)

    
    return (
     <div className="row justify-content-center"> 
      <Card style={{ width: '20rem', margin:10, color:'black' }}>
       <Card.Header style={{textAlign: 'center'}}>
        <PersonAddAltRoundedIcon fontSize='large' style={{float:'left', marginLeft:10, marginTop:5}} />
        <h4 style={{fontFamily: 'sans-serif', marginRight:25, marginTop:5 }}>Регистрация</h4>
        </Card.Header>
        <Form onSubmit={registerUser} style={{margin:10}}>
          <Form.Group className="mb-3">
             <Form.Control type="text" name="username" placeholder="Введите ваше имя пользователя" style={{width: '18rem', margin:5}} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control type="password" name="password1" placeholder="Введите пароль" style={{width: '18rem', margin:5}}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control type="password" name="password2" placeholder="Повторите пароль" style={{width: '18rem', margin:5}}/>
          </Form.Group>
          <div className="row justify-content-center"> 
          <Button variant="contained" type="submit" style={{ fontFamily: 'sans-serif', margin:5, width: '70%' }} >
           Зарегистрироваться
          </Button>
          </div>
        </Form>
      </Card> 
     </div> 
    )
}

export default RegisterPage