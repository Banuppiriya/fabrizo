import React from 'react';

const services = [
  {
    title: 'Business Suits',
    description: 'Professional tailoring for the modern executive. Perfect fit for boardroom confidence.',
    features: ['Premium wool fabrics', 'Full canvas construction', '7-day delivery'],
    price: '$599',
    label: 'Most Popular',
    color: 'bg-gray-900',
    button: 'Start Design',
  },
  {
    title: 'Wedding Attire',
    description: 'Make your special day perfect with our custom wedding suits and dresses.',
    features: ['Luxury fit & premium fabrics', 'Personal design session', '14-day delivery'],
    price: '$899',
    label: 'Premium',
    color: 'bg-rose-400',
    button: 'Start Design',
  },
  {
    title: 'Casual Wear',
    description: 'Comfortable and stylish everyday clothing tailored to your lifestyle.',
    features: ['Cotton & linen blends', 'Comfort/fit guarantee', '5-day delivery'],
    price: '$299',
    label: 'Best Value',
    color: 'bg-green-500',
    button: 'Start Design',
  },
  {
    title: 'Evening Wear',
    description: 'Elegant formal wear for special occasions and evening events.',
    features: ['Designer fabrics & embellishments', 'Custom design consultation', '10-day delivery'],
    price: '$799',
    color: 'bg-purple-500',
    button: 'Start Design',
  },
  {
    title: 'Expert Alterations',
    description: 'Expert alterations to make your existing garments fit perfectly.',
    features: ['All garment types', 'Quick service available'],
    price: '$49',
    color: 'bg-yellow-400',
    button: 'Book Now',
  },
  {
    title: 'Custom Design',
    description: 'Bring your unique vision to life with our custom design service.',
    features: ['One-on-one design consultation', 'Unlimited revisions'],
    price: '$999',
    label: 'Luxury',
    color: 'bg-indigo-400',
    button: 'Consult',
  },
];

const Services = () => {
  return (
    <section className="py-16 px-6 bg-white min-h-screen">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800">Premium Tailoring Services</h2>
        <p className="text-gray-600 mt-2">From business suits to evening wear, we craft every piece with precision and passion.</p>
        <p className="mt-4 inline-block px-4 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">
          All services include free alterations & satisfaction guarantee
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {services.map((service, idx) => (
          <div key={idx} className="bg-white shadow rounded-lg p-6 flex flex-col justify-between">
            <div>
              {service.label && (
                <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold mb-2 inline-block">
                  {service.label}
                </span>
              )}
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{service.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{service.description}</p>
              <ul className="text-sm text-gray-700 space-y-1 mb-4">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">✔</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto">
              <p className="text-xl font-bold text-gray-800 mb-2">{service.price} <span className="text-sm text-gray-500">starting</span></p>
              <button
                className={`w-full px-4 py-2 text-white font-medium rounded-md hover:opacity-90 transition ${service.color}`}
              >
                {service.button}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-16 bg-blue-50 py-6 px-4 rounded-xl max-w-4xl mx-auto text-center text-sm font-medium text-gray-700">
        <div className="flex flex-wrap justify-center gap-6">
          <span>🧵 Free Alterations <span className="text-xs text-gray-500">until you're 100% satisfied</span></span>
          <span>🚀 Fast Delivery <span className="text-xs text-gray-500">Rush orders available</span></span>
          <span>🛡️ Quality Guarantee <span className="text-xs text-gray-500">Master craftsmanship promise</span></span>
        </div>
      </div>
    </section>
  );
};

export default Services;
