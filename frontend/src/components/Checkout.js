import { Card, Form, ListGroup } from 'react-bootstrap';
import React, { useState, useContext, useEffect } from 'react';
import Button from '@mui/material/Button';
import CartContext from '../cart/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Checkout = () => {
  let {getCart} = useContext(CartContext);
    
  const [ cartItems, setCartItems ] = useState(getCart())
  const [ order, setOrder ] = useState()
  const [ loading, setLoading ] = useState()
  const [ error, setError] = useState()
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [ address, setAddress ] = useState('')
  const [ postalCode, setPostalCode ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ city, setCity ] = useState('')
  
  const navigate = useNavigate()

  
  const getTotalSum = () => {
    return cartItems.reduce((a, b) => {
        return a + (b.quantity*b.price)
    }, 0)
  }

  const createOrder = (e) => {
    e.preventDefault()
    fetch(
      `http://127.0.0.1:8000/api/cart/checkout/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': window.localStorage.getItem('LoginToken') ? `token ${window.localStorage.getItem('LoginToken')}` : null,
          },
        body: JSON.stringify({
          cartItems: cartItems,
          first_name: e.target.username.value,
          last_name: e.target.surname.value,
          email: e.target.email.value,
          address: e.target.address.value,
          postal_code: e.target.postal_code.value,
          city: e.target.city.value,
        })
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw Error(`Something went wrong: code ${response.status}`)
        }
      })
      .then(({id}) => {
        setOrder(id)
        window.localStorage.setItem('OrderID', id)
       
      })  
    console.log('order sent')
    console.log(localStorage)
    navigate('/payment')
  }

  const getProfile = async () => {
    setLoading(true);
    const resp = await axios.get(`http://127.0.0.1:8000/api/api_profile/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${window.localStorage.getItem('LoginToken')}`,
      },
    })
       .then(resp => {
        setFirstName(resp.data.first_name)
        setLastName(resp.data.last_name)
        setAddress(resp.data.address)
        setEmail(resp.data.email)
        setPostalCode(resp.data.postal_code)
        setCity(resp.data.city)
        })
       .catch(err => {
         console.log(err)
         setError('Ошибка, подробности в консоли') 
        })
        .finally(setLoading(false))
    }

  useEffect(() => {
    if(localStorage.getItem('LoginToken')) {
      getProfile()
    }
  },[])

    

  return (
    <>
    
    <Card style={{marginTop:5, width: 700, float: 'right' }}>
        <Card.Header as="h5"><div className="row justify-content-center">Ваш заказ</div></Card.Header>
        <Card.Body>
            {cartItems.map((item, index) => (
              <ListGroup.Item key={index}><img src={item.image} style={{width:100, margin:5}}></img>
              {item.name}, 
               количество: {item.quantity} шт. <h5 style={{textAlign: 'right'}}>Цена {item.price}р.(за 1 шт.)</h5>
              </ListGroup.Item>
              ))}
            <p style={{margin: 15, font: 'Lato', width:500, fontSize: 25 }}> Итого: {getTotalSum()}р. </p>
        </Card.Body>
      </Card>
     
  <Card style={{marginTop:5, width: 405, float:'left'}}>
  <Card.Header as="h5"><div className="row justify-content-center">Данные для доставки</div></Card.Header>
  <Form style={{margin:5}} onSubmit={createOrder}>
  <Form.Control type="text" name="username" value={firstName || ''} placeholder="Имя" onChange={e => setFirstName(e.target.value)} style={{marginBottom:10}} />
  <Form.Control type="text" name="surname" value={lastName || ''} placeholder="Фамилия" onChange={e => setLastName(e.target.value)} style={{marginBottom:10}} />
  <Form.Control type="email" name="email"  value={email || ''} placeholder="Email" onChange={e => setEmail(e.target.value)} style={{marginBottom:10}} />
  <Form.Control type="text" name="address" value={address || ''} placeholder="Адрес" onChange={e => setAddress(e.target.value)} style={{marginBottom:10}} />
  <Form.Control type="text" name="postal_code" value={postalCode || ''} placeholder="Почтовый индекс" onChange={e => setPostalCode(e.target.value)} style={{marginBottom:10}} />
  <Form.Control type="text" name="city" value={city || ''} placeholder="Город" onChange={e => setCity(e.target.value)} style={{marginBottom:10}} />
  <div className="row justify-content-center"><Button variant="contained" type="submit" style={{margin:15, marginTop:5}}>Перейти к оплате</Button></div>
  </Form>
  </Card>
  
  
 </>
  )
}

export default Checkout;
