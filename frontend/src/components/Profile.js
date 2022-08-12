import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, ListGroup, Form } from 'react-bootstrap';
import { format } from 'date-fns';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { BsPencilSquare } from "react-icons/bs";
import CircularProgress from '@mui/material/CircularProgress';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';


const Profile =() => {

 
  const [ loading, setLoading ] = useState(false)
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [ address, setAddress ] = useState('')
  const [ postalCode, setPostalCode ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ city, setCity ] = useState('')
  const [ error, setError] = useState()
  const [ orders, setOrders ] = useState([])

  const navigate = useNavigate()

     
   const getProfile = async () => {
    setLoading(true)
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
    }

    const getUserOrders = async () => {
      const resp = await axios.get(`http://127.0.0.1:8000/api/api_profile_orders/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${window.localStorage.getItem('LoginToken')}`,
        },
      })
         .then(resp => {
          setOrders(resp.data)
          })
         .catch(err => {
           console.log(err)
           setError('Ошибка, подробности в консоли') 
          })
      }  
    
    
useEffect(() => {
  getProfile()
  getUserOrders()
  setTimeout(() => setLoading(false), 1000)
},[])    

  const updateProfile = (e) => {
    e.preventDefault();
    fetch(
      `http://127.0.0.1:8000/api/api_profile_update/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${window.localStorage.getItem('LoginToken')}`,
          },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          address: address,
          email: email,
          postal_code: postalCode,
          city: city,
        })
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        else {
          throw alert("Во время обработки возникла ошибка")
        }
      })
      alert('Данные успешно обновлены')
    }
        
          
   return (
       <> 
     <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" style={{ marginBottom:10, marginTop:10 }}>
        <Link underline="hover" color="inherit" href="#" onClick={() => navigate(`/`)} style={{color:'black'}}>Каталог</Link>
        <Typography>Профиль</Typography>
     </Breadcrumbs>  
            
     <div className="Profile" style={{float:'left'}}>
     <Card style={{marginRight:5}}><Card.Header>Данные для доставки<BsPencilSquare style={{marginLeft:15}}/></Card.Header>
      <Form onSubmit={updateProfile}>
        <Form.Control style={{width:'96%', margin:5 }} value={firstName} placeholder="Укажите ваше имя" onChange={e => setFirstName(e.target.value)}/>
        <Form.Control style={{width:'96%', margin:5 }} value={lastName} placeholder="Укажите вашу фамилию" onChange={e => setLastName(e.target.value)}/>
      
        <Form.Control style={{width:'96%', margin:5 }} value={address} placeholder="Укажите ваш адрес" onChange={e => setAddress(e.target.value)}/>
        <Form.Control style={{width:'96%', margin:5 }} value={email} placeholder="Укажите ваш email"onChange={e => setEmail(e.target.value)}/>
      
        <Form.Control style={{width:'96%', margin:5 }} value={postalCode} placeholder="Укажите ваш почтовый индекс" onChange={e => setPostalCode(e.target.value)}/>
        <Form.Control style={{width:'96%', margin:5 }} value={city} placeholder="Укажите ваш город" onChange={e => setCity(e.target.value)}/>
       <Button variant="contained" type="submit" style={{margin:5}} endIcon={<SendIcon />}>
      Обновить ваши данные
     </Button>
      </Form>
     </Card>  
      </div>
               
      <div>{ loading ? <CircularProgress size='5rem' style={{position: 'absolute', left: '43%', zIndex: 1}} />: null}</div>
      <div id="order list">
        <Card style={{margin:5, color:'black'}}>
          <Card.Header>История ваших заказов</Card.Header>
          {orders.map(order => (<Card border="dark" style={{margin:10}} key={order.id}>
          <Card.Header><strong>Заказ номер {order.id}</strong> от {format(new Date(order.created),'dd/MM/yyyy(hh:mm)')}
          {order.paid ? <Alert severity="success" style={{ width: '20%', display: 'inline-flex', margin: 5 }}>Завершён</Alert> : 
          <Alert severity="error" style={{ width: '20%', display: 'inline-flex', margin: 5 }}>Не оплачен</Alert> }</Card.Header> 
           
           {order.products.map((item, index)  => 
          (<p key={index} style={{margin:5}}>  <img src={item.name.image} width="10%" style={{margin:5}} />
           {item.name.name} , {item.quantity} шт. Цена(за шт.):  {item.price}p. 
          <Button variant="outlined" onClick={() => navigate(`/category/product/${item.name.slug}/`)}>Оставить комментарий к товару</Button> </p>  ))}  

          <p style={{margin:10}}><strong>{"\n"} Итого: {order.get_total_cost}p.</strong></p> 
           
                       
          </Card>))}
                    
        </Card>  
      </div>
        </>  
   );
}

export default Profile;
