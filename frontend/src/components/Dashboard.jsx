import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL_PROD
  : import.meta.env.VITE_API_URL_DEV;

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/profile`, {
          withCredentials: true, // Include cookies in the request
        });
        setProfile(response.data);
      } catch (err) {
        console.error('Error:', err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-4"></div>
        <p className="text-lg">Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
              <div className="bg-blue-500 rounded-full h-24 w-24 flex items-center justify-center mb-4">
                <svg
                  className="h-12 w-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">{profile?.name}</h2>
              <p className="text-gray-600">{profile?.email}</p>
              <div className="w-full border-t border-gray-200 my-4"></div>
              <p className="text-sm">
                Subscription: {profile?.plan || 'Free'}
              </p>
            </div>

            {/* Credits Status */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-4">Credits Status</h3>
              <p className="text-4xl text-blue-500">
                {profile?.credits || 0}
              </p>
              <p className="text-gray-600">Credits Remaining</p>
            </div>

            {/* Account Status */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-4">Account Status</h3>
              <p className="text-lg text-blue-500">
                {profile?.status || 'Active'}
              </p>
              <p className="text-gray-600">
                Member since:{' '}
                {new Date(profile?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            <h3 className="text-lg font-semibold mb-4">Usage Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  label: 'Documents Created',
                  value: profile?.stats?.documents || 0,
                },
                {
                  label: 'Words Generated',
                  value: profile?.stats?.words || 0,
                },
                {
                  label: 'Usage Time (hrs)',
                  value: profile?.stats?.hours || 0,
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <div className="bg-blue-500 rounded-full h-16 w-16 flex items-center justify-center mb-2">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {/* Icon paths can be customized based on the stat */}
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
