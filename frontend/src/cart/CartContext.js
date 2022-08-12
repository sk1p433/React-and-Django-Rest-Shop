import { createContext, useState, useCallback} from 'react';

const CartContext = createContext();


export default CartContext;

export const CartProvider = ({children}) => {

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  
  const getCart = () => {
    if (typeof window !=="undefined") {
      if (localStorage.getItem('cart')) {
        return JSON.parse(localStorage.getItem('cart'))
        }
    }
    return []
   };


const addItem = (name, price, id, image) => {
  let cart = []
  if (typeof window !=="undefined") {
    if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart'))
    }
    const check_index = cart.findIndex(item => item.id === id);
    if (check_index !== -1) {
      cart[check_index].quantity++;
      console.log("Quantity updated:", cart);
      localStorage.setItem('cart', JSON.stringify(cart))
      forceUpdate()
    }
    else  {
    cart.push({
      name: name,
      price: price,
      id: id,
      quantity: 1,
      image: image,
    })
    localStorage.setItem('cart', JSON.stringify(cart))
    forceUpdate()
    }
  }
};

const updateCart = (itemIndex, quantity) => {
  let cart = []
  if (typeof window !== "undefined") {
    if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart'))
    }
    cart[itemIndex].quantity = quantity
    localStorage.setItem('cart', JSON.stringify(cart))
    forceUpdate()
  }
};


const removeItem = (itemIndex) => {
  let cart = []
  if (typeof window !=="undefined") {
    if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart'))
    }
    cart.splice(itemIndex, 1)
    localStorage.setItem('cart', JSON.stringify(cart))
    forceUpdate()
  }
  return cart
};

const emptyCart = () => {
  if (typeof window !=="undefined") {
    localStorage.removeItem('cart')
    forceUpdate()
  }
}

const cartContextData = {
  addItem:addItem,
  updateCart:updateCart,
  getCart:getCart,
  removeItem:removeItem,
  emptyCart:emptyCart,
}



  return (
    <CartContext.Provider value={cartContextData}>
     {children}
    </CartContext.Provider>
  );
}
