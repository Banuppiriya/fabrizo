import React from 'react';
import theme from '../theme'; // Corrected: Removed curly braces for default import
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

const Contact = () => {
  const contactInfo = [
    { icon: <FaEnvelope />, text: 'support@fabrizo.com', href: 'mailto:support@fabrizo.com' },
    { icon: <FaPhone />, text: '+1 (234) 567-890', href: 'tel:+1234567890' },
    { icon: <FaMapMarkerAlt />, text: '123 Fashion St, New York, NY', href: '#' },
  ];

  // Placeholder for form submission logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    const role = formData.get('role'); // Added role field
    try {
      await axios.post('/contact', { name, email, message });
      alert('Message sent!');
    } catch (error) {
      alert('Failed to send message. Please try again later.');
    }
  };


  return (
    <div style={{ backgroundColor: theme.colors.background }} className="py-16 px-6 md:px-20 font-['Montserrat']"> {/* Added font */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 style={{ color: theme.colors.primary, fontFamily: theme.fonts.heading }} className="text-4xl font-bold">
            Get in Touch
          </h1>
          <p style={{ color: theme.colors.textSecondary }} className="mt-2">
            We'd love to hear from you. Send us a message and we'll get back to you shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-lg shadow-lg"> {/* Added onSubmit */}
            <InputField label="Your Name" type="text" placeholder="Enter your name" name="name" /> {/* Added name prop */}
            <InputField label="Email Address" type="email" placeholder="you@example.com" name="email" /> {/* Added name prop */}
            <TextareaField label="Message" placeholder="Type your message here..." name="message" /> {/* Added name prop */}
            <button
              type="submit"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.white,
                borderRadius: theme.borderRadius,
              }}
              className="w-full py-3 font-semibold rounded-md shadow-md hover:opacity-90 transition"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info & Image */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 style={{ color: theme.colors.text, fontFamily: theme.fonts.heading }} className="text-xl font-semibold mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <a key={index} href={item.href} className="flex items-center space-x-4 group">
                    <div style={{ color: theme.colors.primary }} className="text-xl">{item.icon}</div> {/* Added text-xl for icons */}
                    <span style={{ color: theme.colors.textSecondary }} className="group-hover:text-[#1C1F43] transition"> {/* Changed hover color to deep navy blue */}
                      {item.text}
                    </span>
                  </a>
                ))}
              </div>
            </div>
            {/* Added styling for the image to blend better */}
            <img
              src="/src/assets/logiin.jpg" // Ensure this path is correct relative to your project root
              alt="Contact"
              className="w-full h-64 object-cover rounded-lg shadow-lg border border-gray-200"
              style={{ borderColor: theme.colors.border }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, ...props }) => (
  <div>
    <label style={{ color: theme.colors.textSecondary }} className="block text-sm font-medium mb-1">{label}</label>
    <input
      {...props}
      required
      style={{
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius,
      }}
      className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B26942] focus:border-transparent transition" // Added focus ring
    />
  </div>
);

const TextareaField = ({ label, ...props }) => (
  <div>
    <label style={{ color: theme.colors.textSecondary }} className="block text-sm font-medium mb-1">{label}</label>
    <textarea
      rows="5"
      {...props}
      required
      style={{
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius,
      }}
      className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B26942] focus:border-transparent transition" // Added focus ring
    />
  </div>
);

export default Contact;