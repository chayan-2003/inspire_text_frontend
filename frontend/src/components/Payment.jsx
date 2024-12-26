import React, { useContext, useState } from 'react';
import { PlanContext } from '../context/PlanContext';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from './Navbar';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { Box, Container, Typography, TextField, Button, Paper } from '@mui/material';

const stripePromise = loadStripe('pk_test_51QYQkcAQysK3G8ZyqYq4klC0TABE9ZhjVUo2IihyzCd0SR1teSIyrw8Na47ZDGZwaYT0BxdmIhwxa2pwovy7LjWB00zqxW7VCq');

const CheckoutForm = ({ plan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe is still loading.');
      setLoading(false);
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const API_URL = import.meta.env.PROD ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV;
    try {
      const { data } = await axios.post(
        `${API_URL}/api/users/payment`,
        {
          amount: plan === 'basic' ? 2900 : plan === 'pro' ? 5900 : 9900, // Convert dollars to cents
          plan,
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name,
            email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent?.status === 'succeeded') {
        setSuccess(true);
        // Update the user's plan on the server
        await axios.post(
           `${API_URL}/api/users/updatePlan`,
          { plan },
          {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  const elementStyle = {
    style: {
      base: { fontSize: '18px', color: '#333' },
      invalid: { color: '#e74c3c' },
    },
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-3xl w-full mx-auto bg-white p-8 md:p-12 mt-10 rounded-lg shadow space-y-8">
        <Typography variant="h4" className="text-center mb-6">Payment for {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan</Typography>
        <TextField
          label="Full Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="bg-gray-50 p-4 rounded border space-y-4">
          <div>
            <label className="block text-lg mb-2">Card Number</label>
            <div className="p-3 rounded border bg-white">
              <CardNumberElement options={elementStyle} />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="w-full">
              <label className="block text-lg mb-2">Expiry Date</label>
              <div className="p-3 rounded border bg-white">
                <CardExpiryElement options={elementStyle} />
              </div>
            </div>
            <div className="w-full">
              <label className="block text-lg mb-2">CVC</label>
              <div className="p-3 rounded border bg-white">
                <CardCvcElement options={elementStyle} />
              </div>
            </div>
          </div>
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!stripe || loading}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </Button>
        {error && <Typography color="error" className="mt-4 text-center">{error}</Typography>}
        {success && <Typography color="primary" className="mt-4 text-center">Payment successful! Credits updated.</Typography>}
      </form>
    </>
  );
};

function Payment() {
  const { plan } = useContext(PlanContext);

  return (
    <>
      <Navbar />
      <Box className="bg-gray-100 min-h-screen py-16">
        <Container maxWidth="sm">
          <Paper elevation={3} className="p-6">
            <Elements stripe={stripePromise}>
              <CheckoutForm plan={plan} />
            </Elements>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default Payment;