import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-16 relative">
        <p className="text-center mb-4 text-xs absolute top-2 left-1/2 transform -translate-x-1/2">
          Remaining Credits: {remainingCredits}
        </p>
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Text Summarizer</h2>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg mb-4"
            rows="6"
            placeholder="Enter text to summarize"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <input
            type="number"
            className="w-full p-4 border border-gray-300 rounded-lg mb-4"
            placeholder="Number of words"
            value={words}
            onChange={(e) => setWords(e.target.value)}
          />
          <button
            onClick={handleSummarize}
            disabled={loading || remainingCredits <= 0}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            {loading ? 'Summarizing...' : 'Summarize Text'}
          </button>
          {error && (
            <p className="mt-4 text-red-500 text-center">{error}</p>
          )}
          {summary && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Summary:</h3>
              <p className="mt-2 p-4 bg-gray-100 rounded-lg">{summary}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Summarizer;