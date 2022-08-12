import React, { useState, useEffect } from 'react';
import BraintreeDropIn from "./BraintreeDropIn";
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';


const PaymentForm = () =>  {

  const [showBraintreeDropIn, setShowBraintreeDropIn] = useState(false);
  const [clientToken, setClientToken] = useState('');
  const [ loading, setLoading ] = useState(false)
  
  const getClientToken = async () => {
    setLoading(true)
    const resp = await axios.get(`http://127.0.0.1:8000/api/cart/api_get_token/`)
       .then(resp => {
        setClientToken(resp.data)
        })
       .catch(err => {
         console.log(err);
       });
    }
  
   useEffect(() => {
    getClientToken()
    setShowBraintreeDropIn(true)
    setTimeout(() => setLoading(false), 1000)
   }, [])

     
  return (

    
    <div className="row justify-content-center">
        <div>{ loading ? <CircularProgress size='5rem' style={{position: 'absolute', left: '43%', zIndex: 3}} />: null}</div>
        <BraintreeDropIn
            data={clientToken}
            show={showBraintreeDropIn}
            onPaymentCompleted={() => {
                setShowBraintreeDropIn(false);
            }}
        />
    </div>
     
  
 );
}
export default PaymentForm;