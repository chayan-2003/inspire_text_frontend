import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import { AuthContext } from '../authContext/authContext';

const Correct = () => {
  const [text, setText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [credits, setCredits] = useState({ used: 0, remaining: 0 });

  const { isAuthenticated } = useContext(AuthContext);
  const API_URL = import.meta.env.PROD ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/profile`, {
          withCredentials: true,
        });
        setCredits({
          used: response.data.credits_used,
          remaining: response.data.credits,
        });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const handleCorrect = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${API_URL}/api/users/grammarly`,
        {
          prompt: text,
        },
        {
          withCredentials: true,
        }
      );
      setCorrectedText(response.data.correctedText);
      setCredits((prevCredits) => ({
        ...prevCredits,
        used: prevCredits.used + 1,
        remaining: prevCredits.remaining - 1,
      }));
    } catch (err) {
      setError('Failed to correct text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-16">
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold text-center mb-6">Grammar Correction</h2>
            <p className="text-center text-gray-600 mb-4">Remaining Credits: {credits.remaining}</p>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg mb-4"
              rows="6"
              placeholder="Enter text to correct"
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <button
              onClick={handleCorrect}
              disabled={loading || credits.remaining <= 0}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            >
              {loading ? 'Correcting...' : 'Correct Text'}
            </button>
            {error && (
              <p className="text-red-500 text-center mt-4">{error}</p>
            )}
            {correctedText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-6"
              >
                <h3 className="text-xl font-semibold">Corrected Text:</h3>
                <p className="mt-2 p-4 bg-gray-100 rounded-lg">{correctedText}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Correct;