import React, { useState } from 'react';
import axios from '../utils/axiosInstance';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    
    try {
      const response = await axios.post('/newsletter/subscribe', { email });
      setMessage(response.data.message);
      setEmail('');
      setIsError(false);
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-200 py-16 font-['Montserrat']">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <h2 className="text-4xl font-['Playfair_Display'] font-extrabold text-[#1C1F43] mb-6">
          Be the First to Know
        </h2>
        <p className="text-lg text-[#3B3F4C] mb-8">
          Subscribe to our newsletter for exclusive offers, new collection launches,
          and insights into the art of bespoke tailoring.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="flex-grow p-4 border border-[#B26942] rounded-lg shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-[#1C1F43]
                       placeholder-gray-500 text-[#3B3F4C] text-base bg-white/80
                       disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`group relative inline-flex items-center justify-center overflow-hidden
                       rounded-lg bg-[#1C1F43] py-4 px-8 font-bold text-[#F2E1C1] shadow-xl
                       transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl text-lg
                       disabled:opacity-50 disabled:cursor-not-allowed ${isLoading ? 'animate-pulse' : ''}`}
          >
            <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-[#1C1F43] via-[#3B3F4C] to-[#1C1F43]
                             opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
            <span className="relative">{isLoading ? 'Subscribing...' : 'Subscribe Now'}</span>
          </button>
        </form>
        {message && (
          <p className={`mt-6 text-center text-lg font-semibold ${
            isError ? 'text-red-600' : 'text-green-700'
          }`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
};

export default NewsletterSignup;