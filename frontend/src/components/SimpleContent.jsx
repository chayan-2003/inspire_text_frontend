import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { Typography } from '@mui/material';
import { AuthContext } from '../authContext/authContext';

 export const SimpleContent = () => {
  const [heading, setHeading] = useState('');
  const [tone, setTone] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState(0);

  const { isAuthenticated } = useContext(AuthContext);
  const API_URL = import.meta.env.PROD ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV;
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get( `${API_URL}/api/users/profile`, {
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
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput('');
    setShowResult(false);

    try {
      const response = await axios.post(
            `${API_URL}/api/users/gemini`,
        { heading, tone },
        {
          withCredentials: true,
        }
      );
      setOutput(response.data.response);
      setShowResult(true);
      setRemainingCredits((prevCredits) => prevCredits - 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Error generating content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-4 relative">
        <Typography variant="body2" className="text-center text-xs absolute top-10 left-1/2 transform -translate-x-1/2">
          Remaining Credits: {remainingCredits}
        </Typography>
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Gemini Content Generator</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="heading" className="block text-sm font-medium text-gray-700">
                Heading
              </label>
              <input
                type="text"
                id="heading"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
                Tone
              </label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a tone</option>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading || remainingCredits <= 0} // Disable if no credits left
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-red-500">
              {error}
            </p>
          )}

          {loading && (
            <div className="mt-4 flex flex-col items-center">
              <div className="spinner-3d"></div>
              <p className="mt-2 text-gray-600">Generating...</p>
            </div>
          )}
        </div>

        <div className="bg-white mt-4 p-8 rounded-lg shadow-lg w-full max-w-md min-h-[200px]">
          {showResult ? (
            <>
              <h3 className="text-xl font-semibold mb-2">{heading}</h3>
              <p className="whitespace-pre-line">{output}</p>
            </>
          ) : (
            <p className="text-gray-500">Your generated content will appear here...</p>
          )}
        </div>
      </div>
    </>
  );
};

