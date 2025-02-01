import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlanContext } from '../context/PlanContext';
import Navbar from './Navbar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const plans = [
  {
    tier: 'Basic',
    price: 10,
    features: ['20 Credits', 'Basic Support', 'Limited Access'],
  },
  {
    tier: 'Pro',
    price: 20,
    features: ['100 Credits', 'Priority Support', 'Advanced Features'],
  },
  {
    tier: 'Premium',
    price: 35,
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

  const handlePlanSelection = (tier) => () => {
    setPlan(tier.toLowerCase());
    navigate('/payment');
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-pink-100 to-white py-12">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-bold text-gray-800 mb-8">
            Choose Your Plan
          </h3>
          <div className="flex  flex-wrap gap-20 justify-center">
            {plans.map(({ tier, price, features }, idx) => (
              <div
                key={idx}
                className="w-full md:w-1/4 bg-white rounded-lg shadow-lg p-3 transform transition-transform duration-300 hover:scale-105"
              >
                <h5 className="text-2xl font-bold text-gray-800 mb-4">{tier}</h5>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  ${price}
                  <span className="text-sm text-gray-600">/one-time</span>
                </h3>
                <ul className="text-left mb-6">
                  {features.map((feat, i) => (
                    <li key={i} className="flex items-center mb-2">
                      <CheckCircleIcon className="text-pink-500 mr-2" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handlePlanSelection(tier)}
                  className="bg-pink-500 text-white py-2 px-4 rounded-full hover:bg-pink-600 transition duration-300"
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Pricing;
