import React, { useEffect, useState, useContext } from 'react';
import dropin from "braintree-web-drop-in";
import CartContext from '../cart/CartContext';
import AuthContext from '../context/AuthContext';
import Button from '@mui/material/Button';
import './BraintreeDropIn.css';
import { useNavigate, } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';


export default function BraintreeDropIn(props) {
    const { show, onPaymentCompleted } = props;

    const [braintreeInstance, setBraintreeInstance] = useState(undefined);
                        
    const {emptyCart} = useContext(CartContext);
    const {notifySuccesPurchase} = useContext(AuthContext);
    const navigate = useNavigate()
    

           
    useEffect(() => {
        if (show) {
            const initializeBraintree = () => dropin.create({
                // insert your tokenization key or client token here, training variant
                authorization: props.data,
                container: '#braintree-drop-in-div',
            }, function (error, instance) {
                if (error)
                    console.error(error);

                else
                    setBraintreeInstance(instance);
            });

            if (braintreeInstance) {
                braintreeInstance
                    .teardown()
                    .then(() => {
                        initializeBraintree();
                    });
            } else {
                initializeBraintree();
            }
        }
    }, [show, props.data]);
            

    return (
        <>
        <div
            style={{ display: `${show ? "block" : "none"}`}}
        >
            <div style={{ width: '75%' }}
                id={"braintree-drop-in-div"} />
            <Button 
                className={"braintreePayButton"}
                variant="contained"
                color="success"
                style={{ float:'bottom', width: '75%' }}
                disabled={!braintreeInstance}
                onClick={() => {
                    if (braintreeInstance) {
                        braintreeInstance.requestPaymentMethod(
                            (error, payload) => {
                                if (error) {
                                    console.error(error);
                                } else {
                                    const paymentMethodNonce = payload.nonce;
                                    console.log("payment method nonce", payload.nonce);

                                    // TODO: use the paymentMethodNonce to
                                    //  call you server and complete the payment here
                                    // ...

                                    fetch(
                                        `http://127.0.0.1:8000/api/cart/api_payment_process/`,
                                        {
                                          method: 'POST',
                                          headers: {
                                            'Content-Type': 'application/json',
                                            },
                                          body: JSON.stringify({
                                               orderid: localStorage.getItem('OrderID'),
                                               paymentMethodNonce: paymentMethodNonce,
                                          })  
                                        })
                                    //alert(`Вы успешно оплатили покупку`);
                                    notifySuccesPurchase()
                                    onPaymentCompleted();
                                    emptyCart()
                                    localStorage.removeItem('OrderID')
                                    navigate('/cart')
                                    
                                }
                            });
                    }
                }}
            >
                {"Оплатить"}
            </Button>
            <Alert severity="info" style={{ marginTop: 35, width: '75%', left: '37%', bottom: '30%', right: '37%'}}>
                <AlertTitle style={{ fontFamily: 'Lato', fontWeight: 300, fontSize: 35 }}>Подсказка</AlertTitle>
            <Typography style={{ fontFamily: 'Lato', fontWeight: 200, fontSize: 20 }}>
            Для успешной оплаты вы можете использовать тестовую карту:
            </Typography>
            <p style={{marginTop: 10}}><strong>Card Number: 4111 1111 1111 1111</strong></p>
            <p style={{marginTop: 10}}><strong>Expiration Date: 10/22</strong></p>
            </Alert>    
        </div>
        
        
        
        
    </>
    );
}
