import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/fabrizo1.png';
import { CheckCircle, ArrowRight } from 'lucide-react';
import LiveStats from '../components/LiveStats';
import NewsletterSignup from '../components/NewsletterSignup';
import BlogPreview from '../components/BlogPreview';

// Carousel Images
const carouselImages = [
  { src: '/src/assets/stitch.jpg', alt: 'Tailored Suit on Man' },
  { src: '/src/assets/machine.jpg', alt: 'Close-up of Tailoring Tools' },
  { src: '/src/assets/design.jpg', alt: 'Fabric Rolls for Tailoring' },
];

// Carousel Component
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
              idx === currentIndex ? 'bg-blue-600' : 'bg-blue-200'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Services Data
const services = [
  {
    title: 'Custom Suits',
    image: '/src/assets/customsuits.jpg',
    description: 'Experience the unparalleled elegance of a suit tailored exclusively for you.',
    price: 5000.00,
    features: ['Personalized fittings', 'Premium fabric selection', 'Hand-stitched details', 'Lifetime adjustments'],
  },
  {
    title: 'Sherwani & Tuxedos',
    image: '/src/assets/sherwani.jpg',
    description: 'Make a statement with our exquisite Sherwanis and Tuxedos.',
    price: 3000.00,
    features: ['Luxurious materials', 'Intricate embroidery', 'Modern & classic designs', 'Event-ready delivery'],
  },
  {
    title: 'Wedding Attire',
    image: '/src/assets/wedding.jpg',
    description: 'We craft timeless wedding suits and attire that reflect your unique love story.',
    price: 8000.00,
    features: ['Groom & Groomsmen packages', 'Fabric matching', 'Theme coordination', 'Express tailoring'],
  },
  {
    title: 'Shirt & Trousers',
    image: '/src/assets/shirt.jpg',
    description: 'Elevate your daily style with custom-tailored shirts and trousers.',
    price: 2500.00,
    features: ['Wide range of fabrics', 'Custom collar & cuff styles', 'Perfect silhouette', 'Durable stitching'],
  },
  {
    title: 'Alterations & Repairs',
    image: '/src/assets/alter.jpg',
    description: 'Breathe new life into your beloved garments with expert alterations.',
    price: 500.00,
    features: ['Resizing', 'Zipper & button repair', 'Hemming', 'Fabric reinforcement'],
  },
  {
    title: 'Corporate Uniforms',
    image: '/src/assets/corporate.jpg',
    description: 'Project professionalism with custom-designed corporate uniforms.',
    price: 1500.00,
    features: ['Bulk discounts', 'Logo embroidery', 'Various styles', 'Durable fabrics'],
  },
];

// Home Component
const Home = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const [servicesHeadingVisible, setServicesHeadingVisible] = useState(false);
  const [servicesCardsVisible, setServicesCardsVisible] = useState({});
  const [contactHeadingVisible, setContactHeadingVisible] = useState(false);
  const [contactFormVisible, setContactFormVisible] = useState(false);

  const servicesRef = useRef(null);
  const servicesHeadingRef = useRef(null);
  const servicesCardsParentRef = useRef(null);
  const contactHeadingRef = useRef(null);
  const contactFormRef = useRef(null);

  const scrollToServices = () => {
    servicesRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const setupIntersectionObserver = useCallback((targetRef, setVisibleState, delay = 0) => {
    if (targetRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => setVisibleState(true), delay);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(targetRef.current);
    }
  }, []);

  useEffect(() => {
    setHeroVisible(true);
    setupIntersectionObserver(servicesHeadingRef, setServicesHeadingVisible);

    if (servicesCardsParentRef.current) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            Array.from(entry.target.children).forEach((card, index) => {
              setTimeout(() => {
                setServicesCardsVisible(prev => ({ ...prev, [index]: true }));
              }, index * 150);
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      observer.observe(servicesCardsParentRef.current);
    }

    setupIntersectionObserver(contactHeadingRef, setContactHeadingVisible);
    setupIntersectionObserver(contactFormRef, setContactFormVisible, 200);
  }, [setupIntersectionObserver]);

  return (
    <main className="bg-gray-200 font-['Montserrat']">

      {/* Hero Section */}
      <section
  className="relative h-screen bg-cover bg-center flex items-center justify-center text-white"
  style={{
    backgroundImage: `url(${backgroundImage})`,
    backgroundAttachment: 'fixed', // optional parallax effect
  }}
>
  {/* Blur & Dark Overlay */}
  <div className="absolute inset-0 backdrop-blur-sm bg-black/50 z-10"></div>

  <div className="relative z-20 text-center px-4 md:px-8">
    {/* Description Line – ABOVE headline */}
    <p className={`text-md md:text-xl text-theme-text mb-4 transition-all duration-1000 ease-out delay-100 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      From bespoke suits to custom dresses, we craft garments uniquely yours.
    </p>

    {/* Headline */}
    <h1 className={`text-4xl md:text-6xl font-['Playfair_Display'] font-bold text-white transition-all duration-1000 ease-out ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      Experience True Tailoring
    </h1>

    {/* CTA Button */}
    <button
      onClick={scrollToServices}
      className={`group relative inline-flex items-center justify-center rounded-full mt-10 bg-[#B26942] py-4 px-6 font-bold text-white shadow-xl transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl delay-300 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
    >
      <span className="relative flex items-center">
        Explore Our Services
        <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" size={20} />
      </span>
    </button>
  </div>
</section>


      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <LiveStats />
        </div>
      </section>

      {/* Carousel */}
      <section className="py-12 bg-gray-200">
        <DemoCarousel />
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <NewsletterSignup />
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16 bg-gray-200">
        <div className="container mx-auto px-6">
          <BlogPreview />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" ref={servicesRef} className="py-20 bg-gray-300 font-['Montserrat']">
        <div className="container mx-auto px-6 max-w-7xl">
          <div ref={servicesHeadingRef} className="text-center mb-16">
            <h2 className={`text-5xl font-['Playfair_Display'] font-extrabold text-[#1C1F43] mb-4 transition-all duration-700 ease-out ${servicesHeadingVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <span className="text-theme-heading">Our Masterful Creations</span>
            </h2>
            <p className={`text-xl text-[#3B3F4C] max-w-3xl mx-auto transition-all duration-700 ease-out delay-200 ${servicesHeadingVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <span className="text-theme-text">Discover the art of bespoke tailoring. Each service reflects timeless elegance.</span>
            </p>
          </div>

          <div ref={servicesCardsParentRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <article key={index} className={`group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col ${servicesCardsVisible[index] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x250?text=Image+Not+Found';
                      e.target.className = 'w-full h-full object-cover bg-gray-200';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 right-4 text-3xl font-['Playfair_Display'] font-extrabold text-[#F2E1C1] drop-shadow-md">
                    {service.title}
                  </h3>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <p className="text-gray-700 mb-4 flex-grow text-base leading-relaxed">{service.description}</p>
                  <p className="text-3xl font-extrabold text-[#B26942] mb-4">
                    {new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(service.price)}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-[#3B3F4C]">
                        <CheckCircle className="text-[#B26942] mr-3" size={20} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/services" className="mt-auto block">
                    <button className="group w-full inline-flex items-center justify-center rounded-lg bg-[#1C1F43] py-3 px-6 font-bold text-[#F2E1C1] transition duration-300 hover:bg-transparent hover:text-[#1C1F43] border-2 border-[#1C1F43] text-lg">
                      <span className="relative flex items-center">
                        Discover More
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
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
      <section id="contact" className="py-20 bg-gray-200">
        <div className="container mx-auto px-6">
          <h2 ref={contactHeadingRef} className={`text-4xl font-['Playfair_Display'] font-bold mb-8 text-center text-[#1C1F43] transition-all duration-700 ease-out ${contactHeadingVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="text-theme-heading">Get in Touch with Our Tailors</span>
          </h2>
          <div ref={contactFormRef} className={`max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg transition-all duration-700 ease-out delay-200 ${contactFormVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#3B3F4C]">Name</label>
                <input type="text" id="name" name="name" required className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-[#B26942] focus:border-[#B26942] text-[#3B3F4C]" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#3B3F4C]">Email</label>
                <input type="email" id="email" name="email" required className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-[#B26942] focus:border-[#B26942] text-[#3B3F4C]" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#3B3F4C]">Message</label>
                <textarea id="message" name="message" rows="4" required className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-[#B26942] focus:border-[#B26942] text-[#3B3F4C]"></textarea>
              </div>
              <div className="text-center">
                <button type="submit" className="group inline-flex items-center justify-center rounded-lg bg-[#B26942] py-3 px-6 font-bold text-[#F2E1C1] shadow-md transition duration-300 hover:scale-105 hover:shadow-lg">
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
