import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/fabrizo1.png'; // Your hero background image
import { CheckCircle, ArrowRight } from 'lucide-react'; // Added ArrowRight for buttons
import LiveStats from '../components/LiveStats';
import NewsletterSignup from '../components/NewsletterSignup'; // CORRECTED IMPORT PATH
import BlogPreview from '../components/BlogPreview';

// --- START MOCK DATA & CAROUSEL ---

// Tailoring images for carousel
const carouselImages = [
  {
    src: '/src/assets/stitch.jpg',
    alt: 'Tailored Suit on Man',
  },
  {
    src: '/src/assets/machine.jpg',
    alt: 'Close-up of Tailoring Tools',
  },
  {
    src: '/src/assets/design.jpg',
    alt: 'Fabric Rolls for Tailoring',
  },
];


// Carousel component (kept as is, but ensuring color consistency)
const DemoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-lg shadow-lg my-12">
      {carouselImages.map((image, index) => (
        <img
          key={index}
          src={image.src}
          alt={image.alt}
          className={`w-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 relative' : 'opacity-0 absolute top-0 left-0'
          }`}
          style={{ height: '400px' }}
        />
      ))}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {carouselImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-3 w-3 rounded-full ${
              idx === currentIndex ? 'bg-blue-600' : 'bg-blue-200' // Changed colors
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// --- END MOCK DATA & CAROUSEL ---


const Home = () => {
  // Service data - MOCK DATA - IMPORTANT: Fetch this from your backend in a real app
const services = [
  {
    title: 'Custom Suits',
    image: '/src/assets/customsuits.jpg',
    description: 'Experience the unparalleled elegance of a suit tailored exclusively for you, ensuring a perfect fit and sophisticated style.',
    price: 65000.00,
    features: [
      'Personalized fittings',
      'Premium fabric selection',
      'Hand-stitched details',
      'Lifetime adjustments'
    ],
    imageDescription: 'Tailor carefully measuring a suit on a mannequin — showcasing the precision of custom tailoring.'
  },
  {
    title: 'Sherwani & Tuxedos',
    image: '/src/assets/sherwani.jpg',
    description: 'Make a statement with our exquisite Sherwanis and Tuxedos, designed for grand occasions where every detail counts.',
    price: 75000.00,
    features: [
      'Luxurious materials',
      'Intricate embroidery',
      'Modern & classic designs',
      'Event-ready delivery'
    ],
    imageDescription: 'Elegant groom in richly embroidered sherwani and turban — ideal for wedding or formal occasions.'
  },
  {
    title: 'Wedding Attire',
    image:'/src/assets/wedding.jpg',
    description: 'Your special day deserves perfection. We craft timeless wedding suits and attire that reflect your unique love story.',
    price: 80000.00,
    features: [
      'Groom & Groomsmen packages',
      'Fabric matching',
      'Coordination with theme',
      'Express tailoring options'
    ],
    imageDescription: 'Groom with groomsmen dressed in coordinated suits — capturing the unity and elegance of a wedding day.'
  },
  {
    title: 'Shirt & Trousers',
    image: '/src/assets/shirt.jpg',
    description: 'Elevate your daily style with custom-tailored shirts and trousers that offer unmatched comfort and a flawless fit.',
    price: 15000.00,
    features: [
      'Wide range of fabrics',
      'Custom collar & cuff styles',
      'Perfect silhouette',
      'Durable stitching'
    ],
    imageDescription: 'Neatly ironed white shirt and black trousers laid out — representing elegance in everyday wear.'
  },
  {
    title: 'Alterations & Repairs',
    image: '/src/assets/alter.jpg',
    description: 'Breathe new life into your beloved garments with our expert alteration and repair services, ensuring a perfect fit.',
    price: 5000.00,
    features: [
      'Resizing & reshaping',
      'Zipper & button repair',
      'Hemming & mending',
      'Fabric reinforcement'
    ],
    imageDescription: 'Tailor’s hands stitching a piece of fabric with a needle — a close-up of precision garment repair.'
  },
  {
    title: 'Corporate Uniforms',
    image:'/src/assets/corporate.jpg',
    description: 'Project professionalism with custom-designed corporate uniforms tailored for comfort and brand consistency.',
    price: 25000.00,
    features: [
      'Bulk order discounts',
      'Logo embroidery',
      'Variety of styles',
      'Durable and comfortable fabrics'
    ],
    imageDescription: 'Team of professionals in matching uniforms — representing corporate identity and unity.'
  },
];


  // State to manage visibility of animated elements
  const [heroVisible, setHeroVisible] = useState(false);
  const [servicesHeadingVisible, setServicesHeadingVisible] = useState(false);
  const [servicesCardsVisible, setServicesCardsVisible] = useState({}); // Object to track individual card visibility
  const [contactHeadingVisible, setContactHeadingVisible] = useState(false);
  const [contactFormVisible, setContactFormVisible] = useState(false);

  // Refs for elements to observe
  const heroRef = useRef(null);
  const servicesRef = useRef(null); // Ref for the services section itself
  const servicesHeadingRef = useRef(null);
  const servicesCardsParentRef = useRef(null); // Parent ref for staggering
  const contactRef = useRef(null); // Ref for the contact section itself
  const contactHeadingRef = useRef(null);
  const contactFormRef = useRef(null);

  // Function to scroll to services section
  const scrollToServices = () => {
    servicesRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  // Callback to set up Intersection Observer
  const setupIntersectionObserver = useCallback((targetRef, setVisibleState, delay = 0) => {
    if (targetRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                setVisibleState(true);
              }, delay); // Add a delay for staggering if needed
              observer.unobserve(entry.target); // Unobserve once visible
            }
          });
        },
        { threshold: 0.3 } // Trigger when 30% of element is visible
      );
      observer.observe(targetRef.current);
    }
  }, []);

  // Effect to set up observers for each section/element
  useEffect(() => {
    // Hero section (initial load animation)
    setHeroVisible(true); // Hero section always visible on load

    // Services section heading
    setupIntersectionObserver(servicesHeadingRef, setServicesHeadingVisible);

    // Services cards (staggered animation)
    if (servicesCardsParentRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Iterate children to set individual card visibility
              Array.from(entry.target.children).forEach((card, index) => {
                setTimeout(() => {
                  setServicesCardsVisible(prev => ({ ...prev, [index]: true }));
                }, index * 150); // Stagger cards by 150ms
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 } // Trigger when 10% of parent is visible
      );
      observer.observe(servicesCardsParentRef.current);
    }

    // Contact section heading
    setupIntersectionObserver(contactHeadingRef, setContactHeadingVisible);

    // Contact form
    setupIntersectionObserver(contactFormRef, setContactFormVisible, 200); // Small delay for form after heading

  }, [setupIntersectionObserver]); // Depend on setupIntersectionObserver to prevent re-creation


  return (
    <main className="bg-[#F2E1C1] font-['Montserrat']">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Adjusted z-index for overlay and text */}
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div> {/* Overlay with z-index 10 */}
        <div className="relative z-20 text-center p-8"> {/* Content with z-index 20 */}
          <h1 className={`text-5xl md:text-6xl font-['Playfair_Display'] font-bold mb-6 text-white transition-all duration-1000 ease-out ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Experience True Tailoring
          </h1>
          <p className={`text-lg md:text-xl mb-8 max-w-3xl mx-auto transition-all duration-1000 ease-out delay-200 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            From bespoke suits to custom dresses, we craft garments that are uniquely yours.
            Our master tailors combine traditional techniques with modern style to deliver unparalleled quality.
          </p>
          <button
            onClick={scrollToServices}
            className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#B26942] py-4 px-6 font-bold text-[#F2E1C1] shadow-xl transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl delay-400 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-[#8B6443] via-[#B26942] to-[#A6764F] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
            <span className="relative flex items-center">
              Explore Our Services
              <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" size={20} />
            </span>
          </button>
        </div>
      </section>

      {/* Live Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <LiveStats />
        </div>
      </section>

      {/* Tailoring Image Carousel */}
      <section className="py-12 bg-[#F2E1C1]">
        <DemoCarousel />
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <NewsletterSignup />
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16 bg-[#F2E1C1]">
        <div className="container mx-auto px-6">
          <BlogPreview />
        </div>
      </section>

      {/* Services Section - The "Tailoring Page" */}
      <section id="services" ref={servicesRef} className="py-20 bg-[#f7f7f7] font-['Montserrat']">
        <div className="container mx-auto px-6 max-w-7xl">
          <div ref={servicesHeadingRef} className="text-center mb-16">
            <h2 className={`text-5xl font-['Playfair_Display'] font-extrabold text-[#1C1F43] mb-4 transition-all duration-700 ease-out ${servicesHeadingVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Our Masterful Creations
            </h2>
            <p className={`text-xl font-medium text-[#3B3F4C] max-w-3xl mx-auto transition-all duration-700 ease-out delay-200 ${servicesHeadingVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Discover the art of bespoke tailoring. Each service is a testament to our dedication
              to perfection, combining time-honored techniques with contemporary elegance.
            </p>
          </div>
          <div ref={servicesCardsParentRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <article
                key={index}
                className={`group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col transform hover:-translate-y-2
                ${servicesCardsVisible[index] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x250?text=No+Service+Image"; // A clear placeholder
                      e.target.className = "w-full h-full object-cover flex items-center justify-center text-center text-gray-500 bg-gray-200"; // Added classes for placeholder style
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div> {/* Darker overlay */}
                  <h3 className="absolute bottom-4 left-4 right-4 text-3xl font-['Playfair_Display'] font-extrabold text-[#F2E1C1] leading-tight drop-shadow-md">
                    {service.title}
                  </h3>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <p className="font-['Montserrat'] text-gray-700 mb-6 flex-grow text-base leading-relaxed">
                    {service.description}
                  </p>
                  {/* LKR Price Formatting */}
                  <p className="text-3xl font-['Playfair_Display'] font-extrabold text-[#B26942] mb-4">
                    {new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(service.price || 0)}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center font-['Montserrat'] text-[#3B3F4C] text-sm">
                        <CheckCircle className="text-[#B26942] mr-3 flex-shrink-0" size={20} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/services" className="mt-auto block">
                    <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-[#1C1F43] py-3 px-6 font-bold text-[#F2E1C1] transition-all duration-300 ease-out hover:bg-transparent hover:text-[#1C1F43] border-2 border-[#1C1F43] w-full text-lg">
                      {/* Inner span for background hover effect */}
                      <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-[#1C1F43] via-[#3B3F4C] to-[#1C1F43] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                      {/* Inner span for text and icon to ensure they are on top of the hover background */}
                      <span className="relative flex items-center transition-colors duration-300 group-hover:text-[#F2E1C1]">
                        Discover More
                        <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" size={20} />
                      </span>
                    </button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="py-20 bg-[#f7f7f7]">
        <div className="container mx-auto px-6">
          <h2
            ref={contactHeadingRef}
            className={`text-4xl font-['Playfair_Display'] font-bold mb-8 text-center text-[#1C1F43] transition-all duration-700 ease-out ${contactHeadingVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            Get in Touch with Our Tailors
          </h2>
          <div
            ref={contactFormRef}
            className={`max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg transition-all duration-700 ease-out delay-200 ${contactFormVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#3B3F4C]">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#B26942] focus:border-[#B26942] text-[#3B3F4C]"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#3B3F4C]">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#B26942] focus:border-[#B26942] text-[#3B3F4C]"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#3B3F4C]">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#B26942] focus:border-[#B26942] text-[#3B3F4C]"
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-[#B26942] py-3 px-6 font-bold text-[#F2E1C1] shadow-md transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg"
                >
                  <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-[#8B6443] via-[#B26942] to-[#A6764F] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                  <span className="relative">Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;