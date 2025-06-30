import React from 'react';
import Navbar from "../components/Navbar"; // ✅ Correct from pages/
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <>
      <Navbar/>
      <div>
        {/* Contact Section */}
        <section className="py-16 px-6 md:px-20 bg-gray-300">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Get in Touch</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* 📸 Contact Image */}
            <div className="flex justify-center">
              <img
                src="/src/assets/contact.jpeg" // 🔁 Replace with your actual image path
                alt="Contact Illustration"
                className="max-w-full h-full rounded-lg shadow-md"
              />
            </div>

            {/* ✉️ Contact Form */}
            <form className="space-y-5 bg-white p-6 rounded-lg shadow">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Message</label>
                <textarea
                  rows="5"
                  placeholder="Type your message here..."
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-[#480101]  text-white px-6 py-2 rounded hover:bg-orange-600 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>

        <Footer/>
      </div>
    </>
  );
};

export default Contact;
