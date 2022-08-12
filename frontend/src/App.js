import React, { Component  } from 'react';

import {
  Route,
  Routes,
  BrowserRouter,
} from 'react-router-dom';
import Container from "react-bootstrap/Container";
import CategoryList from './components//CategoryList';
import CategoryPage from './components/CategoryPage';
import ProductPage from './components/ProductPage';
import Profile from './components/Profile';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Checkout from './components/Checkout';
import PaymentForm from './components/PaymentForm';
import Cart from './cart/Cart';
import "./App.css";
import ShopNavbar from "./components/ShopNavbar";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './cart/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {

  console.log(window.localStorage)


   return (

  <div className='page-container'>
   <BrowserRouter>
    <CartProvider>
     <AuthProvider>
      <ShopNavbar />
       <Container>
         <Routes>
          <Route exact path="/" element={<CategoryList/>} />
          <Route path="/category/:slug" element={<CategoryPage/>} />
          <Route path="/category/product/:slug" element={<ProductPage/>} />
          <Route path="/profile/" element={<Profile />} />
          <Route path="/login/" element={<LoginPage/>} />
          <Route path="/register/" element={<RegisterPage/>} />
          <Route path="/cart/" element={<Cart/>} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/payment" element={<PaymentForm/>} />
        </Routes>
       </Container>
      </AuthProvider>
     </CartProvider>
    </BrowserRouter>
   </div>
  );
}

export default App;
