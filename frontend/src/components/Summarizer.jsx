import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Box, Container, Typography, TextField, Button, Paper } from '@mui/material';
import Navbar from './Navbar';
import { AuthContext } from '../authContext/authContext';

const Summarizer = () => {
  const [text, setText] = useState('');
  const [words, setWords] = useState(100); // Default number of words
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remainingCredits, setRemainingCredits] = useState(0);

  const { isAuthenticated } = useContext(AuthContext);

  const API_URL = import.meta.env.PROD ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/profile`, {
          withCredentials: true,
        });
        setRemainingCredits(response.data.credits);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, API_URL]);

  const handleSummarize = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${API_URL}/api/users/summarize`,
        {
          prompt: text,
          words,
        },
        {
          withCredentials: true,
        }
      );
      setSummary(response.data.summary);
      setRemainingCredits((prevCredits) => prevCredits - 1);
    } catch (err) {
      setError('Failed to summarize text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-16 relative">
        <Typography variant="body2" className="text-center mb-4 text-xs absolute top-2 left-1/2 transform -translate-x-1/2">
          Remaining Credits: {remainingCredits}
        </Typography>
        <Container maxWidth="md">
          <Paper elevation={3} className="p-6">
            <Typography variant="h4" className="text-center mb-6">
              Text Summarizer
            </Typography>
            <TextField
              label="Enter text to summarize"
              multiline
              rows={6}
              variant="outlined"
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mb-4"
            />
            <TextField
              label="Number of words"
              type="number"
              variant="outlined"
              fullWidth
              value={words}
              onChange={(e) => setWords(e.target.value)}
              className="mb-4"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSummarize}
              disabled={loading || remainingCredits <= 0} // Disable if no credits left
              className="w-full"
            >
              {loading ? 'Summarizing...' : 'Summarize Text'}
            </Button>
            {error && (
              <Typography color="error" className="mt-4 text-center">
                {error}
              </Typography>
            )}
            {summary && (
              <Box className="mt-6">
                <Typography variant="h6">Summary:</Typography>
                <Typography>{summary}</Typography>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Summarizer;