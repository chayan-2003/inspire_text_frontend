import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import { AuthContext } from '../authContext/authContext';

const Home = () => {
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
  }, [isAuthenticated, API_URL]);

  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 py-12 ">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center text-white mb-20"
        >
          <h1 className="text-4xl font-bold mb-4">
            {isAuthenticated ? `Welcome to AI Writing Services, ${userName}` : 'Welcome to AI Writing Services'}
          </h1>
          <p className="text-xl mb-8">
            Discover our advanced all-in-one AI solution designed to optimize your writing process.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl px-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-lg shadow-lg text-center"
          >
            <h3 className="text-xl font-bold mb-2">Generate Content</h3>
            <p className="mb-4">Use our AI to generate high-quality content for your needs.</p>
            <Link to="/cont1">
              <button className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">
                Generate Content
              </button>
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-lg shadow-lg text-center"
          >
            <h3 className="text-xl font-bold mb-2">Explore Pricing</h3>
            <p className="mb-4">Check out our pricing plans and choose the best one for you.</p>
            <Link to="/pricing">
              <button className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">
                View Pricing
              </button>
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-lg shadow-lg text-center"
          >
            <h3 className="text-xl font-bold mb-2">Text Summarizer</h3>
            <p className="mb-4">Summarize long texts quickly and easily with our AI-powered text summarizer.</p>
            <Link to="/summarizer">
              <button className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">
                Summarize Text
              </button>
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-lg shadow-lg text-center"
          >
            <h3 className="text-xl font-bold mb-2">Grammar Guru</h3>
            <p className="mb-4">Correct grammar of any sentence or passage with our AI-powered Grammar Guru.</p>
            <Link to="/correct">
              <button className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">
                Correct Grammar
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;