import React, { useContext } from 'react';
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PlanContext } from '../context/PlanContext';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const plans = [
  {
    tier: 'Basic',
    price: 29,
    features: ['20 Credits', 'Basic Support', 'Limited Access'],
  },
  {
    tier: 'Pro',
    price: 59,
    features: ['100 Credits', 'Priority Support', 'Advanced Features'],
    popular: true,
  },
  {
    tier: 'Premium',
    price: 99,
    features: [
      '200 Credits',
      'All Pro Features',
      '24/7 Priority Support',
      'Custom Integrations',
    ],
  },
];

function Pricing() {
  const navigate = useNavigate();
  const { setPlan } = useContext(PlanContext);

  const clicked = (tier) => () => {
    if (tier === 'Basic') {
      setPlan('basic');
      navigate('/payment');
    } else if (tier === 'Pro') {
      setPlan('pro');
      navigate('/payment');
    } else {
      setPlan('premium');
      navigate('/payment');
    }
  };

  return (
    <>
      <Navbar />
      <Box className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen py-16">
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            className="text-center font-bold mb-10 text-white"
            style={{ position: 'relative', top: '-20px' }} // Adjust this value as needed
          >
            Choose Your Plan
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map(({ tier, price, features, popular }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  transformPerspective: 1000,
                }}
              >
                <Paper
                  elevation={popular ? 12 : 4}
                  className={`p-6 relative transform transition-all duration-300 ${
                    popular
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                      : 'bg-white'
                  }`}
                  sx={{
                    borderRadius: '20px',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {popular && (
                    <div className="absolute top-0 right-0 bg-yellow-400 text-xs px-3 py-1 rounded-bl-lg">
                      Most Popular
                    </div>
                  )}
                  <Typography variant="h5" className="mb-4 font-bold">
                    {tier}
                  </Typography>
                  <Typography variant="h3" className="mb-6">
                    ${price}
                    <span className="text-sm">/one-time</span>
                  </Typography>
                  <ul className="space-y-2 mb-6">
                    {features.map((feat, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircleIcon className="text-green-500 mr-2" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={clicked(tier)}
                    variant="contained"
                    color="primary"
                    className="w-full py-2"
                    sx={{
                      borderRadius: '10px',
                      py: 1.5,
                      backgroundColor: 'blue',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    Get Started
                  </Button>
                </Paper>
              </motion.div>
            ))}
          </div>
        </Container>
      </Box>
    </>
  );
}

export default Pricing;