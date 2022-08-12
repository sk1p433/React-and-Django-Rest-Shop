import React, { useContext, useState } from 'react';
import {  Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import AuthContext from '../context/AuthContext';
import CartContext from '../cart/CartContext';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';

const ShopNavbar = () =>{

     const { logoutUser } = useContext(AuthContext)
     const { getCart } = useContext(CartContext)

     const amount = getCart()
     let items_count = amount.reduce((a, b) => { return (Number(a) + Number(b.quantity)) }, [])

          
     const [anchorEl, setAnchorEl] = useState(null);
     const open = Boolean(anchorEl);
     
     const handleOver = (event) => {
     if (anchorEl !== event.currentTarget) {
        setAnchorEl(event.currentTarget);
       }
     };
                  
     const handleClose = () => {
      setAnchorEl(null)
     };

     const navigate = useNavigate()
         
            
  return (
    <div className="menu-container">
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
      <Navbar.Brand><Link to="/" style={{ marginLeft:15, textDecoration: 'none', color: 'white', fontFamily: 'sans-serif', fontSize: 25}}>PC Shop</Link></Navbar.Brand>
   <Nav>
     <Nav.Link as={Link} to="/Cart">
     <ShoppingCartIcon sx={{ fontSize: 30 }} />
     { items_count !=0 ? 
     <Badge badgeContent={items_count} color="primary" style ={{margin: 5, left: -5}}></Badge>
     : null}
     </Nav.Link>
     {window.localStorage.getItem('LoginToken') ?
     <React.Fragment>
            <IconButton
                size="small"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onMouseOver={handleOver}
                color="inherit"
                style={{marginRight:15}}
              >
                <Avatar sx={{ height: '30px', width: '30px', marginLeft:1 }} src="/broken-image.jpg">A</Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                MenuListProps={{ onMouseLeave: handleClose }}
                onClose={handleClose}
              > 
                <MenuItem onClick={() => navigate(`/profile`)} style={{margin:10}}>Профиль</MenuItem>
                <MenuItem onClick={logoutUser} style={{margin:10}}>Выйти</MenuItem>
            </Menu>
      </React.Fragment>
     :
     <React.Fragment> 
     <IconButton
                size="small"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onMouseOver={handleOver}
                color="inherit"
                style={{marginRight:15}}
              >
                <Avatar sx={{ height: '30px', width: '30px', marginLeft:1 }} src="/broken-image.jpg" />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                MenuListProps={{ onMouseLeave: handleClose }}
                onClose={handleClose}
              > 
                <MenuItem onClick={() => navigate(`/login`)} style={{margin:10}}>Войти</MenuItem>
                <MenuItem onClick={() => navigate(`/register`)} style={{margin:10}}>Регистрация</MenuItem>
            </Menu>
      </React.Fragment>
      }
   </Nav>
  </Container>
</Navbar>
</div>
  );
}


export default ShopNavbar;
