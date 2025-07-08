import React, { useState } from 'react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you'd send this email to your backend/newsletter service
    console.log('Newsletter signup email:', email); // For demonstration
    setMessage('Thank you for subscribing to our exquisite updates!');
    setEmail('');
  };

  return (
    <section className="bg-[#F2E1C1] py-16 font-['Montserrat']"> {/* Changed background to F2E1C1 */}
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
            className="flex-grow p-4 border border-[#B26942] rounded-lg shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-[#1C1F43]
                       placeholder-gray-500 text-[#3B3F4C] text-base bg-white/80"
          />
          <button
            type="submit"
            className="group relative inline-flex items-center justify-center overflow-hidden
                       rounded-lg bg-[#1C1F43] py-4 px-8 font-bold text-[#F2E1C1] shadow-xl
                       transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl text-lg"
          >
            <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-[#1C1F43] via-[#3B3F4C] to-[#1C1F43]
                             opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
            <span className="relative">Subscribe Now</span>
          </button>
        </form>
        {message && <p className="mt-6 text-center text-lg text-green-700 font-semibold">{message}</p>}
      </div>
    </section>
  );
};

export default NewsletterSignup;