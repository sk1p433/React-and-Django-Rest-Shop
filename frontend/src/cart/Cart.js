import React, { useState, useContext } from 'react';
import CartContext from '../cart/CartContext';
import Table from 'react-bootstrap/Table';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';
import {  Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const Cart = () => {

    let {removeItem, getCart, updateCart} = useContext(CartContext);
    const [cartItems, setCartItems] = useState(getCart())
    

    const handleChange = index => event => {
       let updatedCartItems = cartItems
         if(event.target.value == 0){
          updatedCartItems[index].quantity = 1
         }else{
         updatedCartItems[index].quantity = event.target.value
    }
    setCartItems([...updatedCartItems])
    updateCart(index, event.target.value)
   }

  const deleteItem = index => event => {
    let updatedCartItems = removeItem(index)
        setCartItems(updatedCartItems)
   }

  const getTotalSum = () => {
    return cartItems.reduce((a, b) => {
        return a + (b.quantity*b.price)
    }, 0)
  }

  const navigate = useNavigate()
   

return (

<React.Fragment>


  <h6 className="row justify-content-center" style={{margin:10, fontFamily: 'Lato', fontWeight: 900, fontSize: 25 }}>Товары в вашей корзине:</h6>

  {(getTotalSum()===0) ? <h1><div className="row justify-content-center">Корзина пуста</div>
  <div className="row justify-content-center"><Button variant="contained" onClick={() => navigate(`/`)} style={{margin:15}}>Перейти в каталог</Button></div></h1> : 
  <div className="table" style={{ color:'white', backgroundColor: 'white' }}>

  <Table responsive bordered hover>
  <thead>
    <tr>
      <th style={{width:300}}>Фото</th>
      <th>Количество</th>
      <th>Товар</th>
      <th>Цена 1шт.</th>
    </tr>
  </thead>
  <tbody>
  {cartItems.map((item, index) => (
  <tr key={index}>
                     <td><img src={item.image} style={{width:100}} alt="Товар без фото"></img> </td>
                     <td><TextField id="standard-number" label="Кол-во" name="quantity" type="number" value={item.quantity} InputLabelProps={{shrink: true,}}
                          onChange={handleChange(index)} variant="standard" style={{ width: 45}}></TextField>
                     <Button onClick={deleteItem(index)} variant="contained" style={{width:90, margin: 10}}>Удалить<input name="id" value={item.id} type="hidden" /></Button></td>
                     <td style={{margin:10, fontFamily: 'Lato', fontWeight: 700, fontSize: 25 }}>{item.name}</td>
                     <td style={{margin:10, fontFamily: 'sans-serif', fontWeight: 500, fontSize: 25 }}>{item.price}р.</td>
                 </tr>
  ))}
</tbody>
</Table>
<h3 style={{ marginBottom:20, marginRight:20, color:'black', fontFamily: 'Lato', float: 'right' }}><strong>Общая сумма: {getTotalSum()}р.</strong></h3>
<Link as={Link} to="/Checkout">
 { (getTotalSum()===0) ? null :
 <Button variant="contained" style={{marginBottom:20, marginLeft:20, width:200 }}>Оформить заказ</Button>
 }
 </Link>
 
</div>
}
</React.Fragment>
  )
}
export default Cart
