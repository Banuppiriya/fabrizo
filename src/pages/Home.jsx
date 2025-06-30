import React from 'react';
import {
  FaImage,
  FaClock,
  FaUserTie,
  FaShieldAlt,
  FaUpload,
  FaUserCheck,
  FaMagic,
  FaCheckCircle,
} from 'react-icons/fa';

const features = [
  {
    icon: <FaImage className="text-3xl text-blue-600" />,
    title: 'Design Upload',
    description: 'Upload your design images and references to create the perfect custom garment tailored to your vision.',
    note: 'Upload in seconds',
    noteColor: 'text-blue-600',
  },
  {
    icon: <FaClock className="text-3xl text-green-600" />,
    title: 'Live Tracking',
    description: 'Monitor your order progress in real-time from cutting to final delivery with photo updates.',
    note: 'Real-time updates',
    noteColor: 'text-green-600',
  },
  {
    icon: <FaUserTie className="text-3xl text-purple-600" />,
    title: 'Master Tailors',
    description: 'Work with certified master tailors who bring decades of experience to your custom garments.',
    note: '15+ years experience',
    noteColor: 'text-purple-600',
  },
  {
    icon: <FaShieldAlt className="text-3xl text-orange-500" />,
    title: 'Perfect Guarantee',
    description: '100% satisfaction guarantee with unlimited free alterations until it’s absolutely perfect.',
    note: 'Unlimited adjustments',
    noteColor: 'text-orange-500',
  },
];

const steps = [
  {
    icon: <FaUpload className="text-4xl text-white" />,
    title: 'Upload Design',
    desc: 'Share your vision, measurements, and style preferences',
    stat: '10K+',
    substat: 'Happy Customers',
    subnote: 'Since 2020',
    color: 'bg-blue-600',
  },
  {
    icon: <FaUserCheck className="text-4xl text-white" />,
    title: 'Expert Matching',
    desc: 'We assign a master tailor specialized in your garment type',
    stat: '50+',
    substat: 'Master Tailors',
    subnote: '15+ years avg. experience',
    color: 'bg-green-500',
  },
  {
    icon: <FaMagic className="text-4xl text-white" />,
    title: 'Crafted to Perfection',
    desc: 'Watch your garment come to life with real-time progress updates',
    stat: '25K+',
    substat: 'Garments Created',
    subnote: 'Premium quality',
    color: 'bg-purple-600',
  },
  {
    icon: <FaCheckCircle className="text-4xl text-white" />,
    title: 'Delivered & Perfected',
    desc: 'Free alterations until you’re 100% satisfied',
    stat: '99%',
    substat: 'Satisfaction Rate',
    subnote: 'Verified reviews',
    color: 'bg-orange-500',
  },
];

const WhyChooseUs = () => (
  <section className="bg-gray-50 py-16 px-6 text-center">
    <h2 className="text-3xl font-bold mb-4 text-gray-800">Why Choose Fabrizo?</h2>
    <p className="text-gray-600 max-w-2xl mx-auto mb-12">
      Revolutionary technology meets traditional craftsmanship to deliver unparalleled tailoring experience.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {features.map((feature, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition">
          <div className="mb-4">{feature.icon}</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
          <p className={`text-sm font-medium ${feature.noteColor}`}>{feature.note}</p>
        </div>
      ))}
    </div>
  </section>
);

const ExperienceSteps = () => (
  <div className="bg-gray-900 text-white py-16 px-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center text-center">
          <div className={`w-14 h-14 flex items-center justify-center rounded-full mb-4 ${step.color}`}>
            <span className="text-lg font-bold">{index + 1}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
          <p className="text-sm mb-4 text-gray-300">{step.desc}</p>
          <div className="text-2xl font-bold">{step.stat}</div>
          <div className="text-sm">{step.substat}</div>
          <div className="text-xs text-gray-400">{step.subnote}</div>
        </div>
      ))}
    </div>
  </div>
);

const CallToAction = () => (
  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-16 px-6 text-center rounded-t-3xl">
    <h2 className="text-3xl font-bold mb-4">Ready to Experience Perfect Tailoring?</h2>
    <p className="mb-8 max-w-2xl mx-auto">
      Join thousands of professionals who trust Fabrizo for their custom garments
    </p>
    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
      <button className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition">
        Start My Design
      </button>
      <button className="border border-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-indigo-600 transition">
        Book Consultation
      </button>
    </div>
    <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-100">
      <span>💰 Money-back guarantee</span>
      <span>🌍 Free worldwide shipping</span>
      <span>🧵 Free alterations</span>
    </div>
  </div>
);

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section
        id="home-section"
        className="hero-bg min-h-screen flex flex-col justify-end items-center text-center text-white px-4 md:px-8 pb-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/src/assets/background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <p className="text-lg md:text-5xl max-w-xl fade-in-down mb-4">
          Premium Online Tailoring, Made Just For You.
        </p>

        <button
          className="btn-gradient px-6 py-3 rounded-lg font-semibold text-black shadow-lg scale-on-hover"
          onClick={() => alert('Get Started clicked!')}
        >
          Get Started
        </button>
      </section>

      {/* Other Sections */}
      <WhyChooseUs />
      <ExperienceSteps />
      <CallToAction />
    </>
  );
};

export default Home;
