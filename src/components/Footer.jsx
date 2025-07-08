import React from 'react';
import { Link } from 'react-router-dom';
// Using react-icons for a wider range of modern icons
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
// If you want more specific icons, you might use lucide-react or heroicons directly.
// For example, if you have lucide-react installed:
// import { Phone, Mail, MapPin } from 'lucide-react';


const Footer = () => {
  // Social media links - using FaX icons for consistent size/style
  const socialLinks = [
    { icon: <FaFacebookF size={20} />, href: 'https://facebook.com/your-page', name: 'Facebook' },
    { icon: <FaTwitter size={20} />, href: 'https://twitter.com/your-handle', name: 'Twitter' },
    { icon: <FaInstagram size={20} />, href: 'https://instagram.com/your-profile', name: 'Instagram' },
    { icon: <FaLinkedinIn size={20} />, href: 'https://linkedin.com/in/your-profile', name: 'LinkedIn' },
  ];

  // Main footer navigation sections
  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { label: 'Home', path: '/' },
        { label: 'Services', path: '/services' },
        { label: 'Pricing', path: '/pricing' }, // Added a common footer link
        { label: 'Blog', path: '/blog' },     // Added a common footer link
        { label: 'Profile', path: '/profile' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', path: '/contact' },
        { label: 'FAQ', path: '/faq' },
        { label: 'Privacy Policy', path: '/privacy-policy' }, // Added common footer link
        { label: 'Terms of Service', path: '/terms-of-service' }, // Added common footer link
      ],
    },
  ];

  // Contact Information - Using specific icons for better visual representation
  const contactInfo = [
    { icon: <FaMapMarkerAlt size={20} />, text: '123 Tailor Lane, Colombo 00700, Sri Lanka' },
    { icon: <FaPhoneAlt size={20} />, text: '+94 77 123 4567' },
    { icon: <FaEnvelope size={20} />, text: 'info@fabrizo.lk' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-gray-700 pb-12">

          {/* Logo, Slogan, and Socials */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-4xl font-extrabold mb-4 text-blue-400">FABRIZO<span className="text-white">-IN HAND</span></h3>
            <p className="text-md text-gray-400 mb-6 max-w-xs">
              Crafting elegance, one stitch at a time. Perfectly tailored just for you.
            </p>
            <div className="flex space-x-5">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-gray-400 hover:text-blue-400 transform hover:scale-110 transition-transform duration-300 ease-in-out"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Navigation Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="font-bold text-xl text-white mb-6 relative after:absolute after:left-1/2 md:after:left-0 after:-bottom-2 after:h-1 after:w-10 after:bg-blue-400 after:rounded-full after:-translate-x-1/2 md:after:translate-x-0">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-base text-gray-400 hover:text-white hover:ml-1 transition-all duration-300 ease-in-out"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-bold text-xl text-white mb-6 relative after:absolute after:left-1/2 md:after:left-0 after:-bottom-2 after:h-1 after:w-10 after:bg-blue-400 after:rounded-full after:-translate-x-1/2 md:after:translate-x-0">
              Contact Us
            </h4>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-center justify-center md:justify-start text-base text-gray-400">
                  <span className="text-blue-400 mr-3 flex-shrink-0">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Copyright */}
        <div className="text-center text-sm text-gray-500 pt-6">
          &copy; {new Date().getFullYear()} Tailor-Made. All rights reserved. Crafted with precision in Gonawala, Sri Lanka.
        </div>
      </div>
    </footer>
  );
};

export default Footer;