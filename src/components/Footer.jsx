import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">FABRIZO</h2>
          <p className="text-sm text-gray-400">Elegance, tailored. Handcrafted in Sri Lanka.</p>
          <div className="flex space-x-4 mt-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <a key={i} href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">Home</Link>
            </li>
            <li>
              <Link to="/services" className="text-gray-400 hover:text-white transition-colors duration-200">Services</Link>
            </li>
            <li>
              <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors duration-200">Pricing</Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <p className="text-sm text-gray-400">
            123 Tailor Lane<br />Colombo, Sri Lanka
          </p>
          <p className="text-sm text-gray-400 mt-2">Email: info@fabrizo.lk</p>
          <p className="text-sm text-gray-400">Phone: +94 77 123 4567</p>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} FABRIZO. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
