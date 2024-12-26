import React, { useContext, useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../authContext/authContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const API_URL = import.meta.env.PROD ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV;
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/profile`, {
          withCredentials: true,
        });
        setUserName(response.data.first_name);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  return (
    <>
      <Navbar />
      <Box className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-50">
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
            style={{ position: 'absolute', top: '150px', right: '2px', left: '3px', transform: 'translate(-50%, -50%)' }}
          >
            <Typography variant="h2" component="h1" className="font-bold mb-100 text-white">
              {isAuthenticated ? `Welcome to AI Writing Services, ${userName}` : 'Welcome to AI Writing Services'}
            </Typography>
            <Typography variant="h5" component="p" className="text-white" margin="20px">
              Discover our advanced all-in-one AI solution designed to optimize your writing process.
            </Typography>
          </motion.div>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 5, transformPerspective: 1000 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <Typography variant="h6" component="h3" className="font-bold">
                  Generate Content
                </Typography>
                <Typography component="p" className="mb-4">
                  Use our AI to generate high-quality content for your needs.
                </Typography>
                <Button
                  component={Link}
                  to="/cont1"
                  variant="outlined"
                  color="primary"
                  className="text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  Generate Content
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={3}>
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 5, transformPerspective: 1000 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <Typography variant="h6" component="h3" className="font-bold mb-2">
                  Explore Pricing
                </Typography>
                <Typography component="p" className="mb-4">
                  Check out our pricing plans and choose the best one for you.
                </Typography>
                <Button
                  component={Link}
                  to="/pricing"
                  variant="outlined"
                  color="primary"
                  className="text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  View Pricing
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={3}>
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 5, transformPerspective: 1000 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <Typography variant="h6" component="h3" className="font-bold mb-2">
                  Text Summarizer
                </Typography>
                <Typography component="p" className="mb-4">
                  Summarize long texts quickly and easily with our AI-powered text summarizer.
                </Typography>
                <Button
                  component={Link}
                  to="/summarizer"
                  variant="outlined"
                  color="primary"
                  className="text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  Summarize Text
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={3}>
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 5, transformPerspective: 1000 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <Typography variant="h6" component="h3" className="font-bold mb-2">
                  Grammar Guru
                </Typography>
                <Typography component="p" className="mb-4">
                  Correct grammar of any sentence or passage with our AI-powered Grammar Guru.
                </Typography>
                <Button
                  component={Link}
                  to="/correct"
                  variant="outlined"
                  color="primary"
                  className="text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  Correct Grammar
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Home;