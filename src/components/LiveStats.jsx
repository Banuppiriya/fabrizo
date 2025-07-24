import React, { useState } from 'react'; // Import useState

const stats = [
  { label: 'Happy Users', value: '100+' },
  { label: 'Custom Orders', value: '250+' },
  { label: 'Tailors', value: '15' },
  { label: 'Years of Experience', value: '10+' },
];

const LiveStats = () => {
  // State to manage the current theme: 'dark' (warm brown), 'light' (clear), or 'navy'
  const [theme, setTheme] = useState('dark'); // 'dark' is your initial warm brown theme

  // Function to toggle between themes: dark -> light -> navy -> dark
  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'dark') {
        return 'light';
      } else if (prevTheme === 'light') {
        return 'navy';
      } else {
        return 'dark';
      }
    });
  };

  // Determine background and text colors based on the current theme
  let sectionBgClass = '';
  let textColorClass = '';
  let buttonClass = '';
  let buttonText = '';

  switch (theme) {
    case 'dark':
      sectionBgClass = 'bg-gray-400'; // Warm Brown
      textColorClass = 'text-white';
      buttonClass = 'bg-white text-[#001F3F] hover:bg-gray-200';
      buttonText = 'Switch to Clear Theme';
      break;
    case 'light':
      sectionBgClass = 'bg-white border-t border-b border-gray-200'; // Clear/Light
      textColorClass = 'text-gray-800';
      buttonClass = 'bg-white text-[#001F3F] hover:bg-gray-200';
      buttonText = 'Switch to Navy Theme';
      break;
    case 'navy':
      // Updated: subtle linear gradient from a lighter navy to a regular navy
      sectionBgClass = 'bg-gradient-to-r from-[#003366] to-[#001F3F]'; // Light navy to navy gradient
      textColorClass = 'text-white';
      buttonClass = 'bg-white text-[#001F3F] hover:bg-gray-200';
      buttonText = 'Switch to Dark Theme';
      break;
    default:
      // Fallback to dark theme if somehow an unknown theme is set
      sectionBgClass = 'bg-[#D2B48C]';
      textColorClass = 'text-white';
      buttonClass = 'bg-white text-[#D2B48C] hover:bg-gray-100';
      buttonText = 'Switch to Clear Theme';
  }

  return (
    <section className={`${sectionBgClass} ${textColorClass} py-12 transition-colors duration-500`}>
      <div className="container mx-auto flex flex-col items-center justify-center px-4 md:max-w-6xl"> {/* Adjusted max-width for desktop */}
        {/* Toggle Theme Button */}
        <button
          onClick={toggleTheme}
          className={`px-6 py-2 rounded-full font-semibold mb-8 shadow-md transition-colors duration-300 ${buttonClass}`}
        >
          {buttonText}
        </button>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4">
              <p className="text-4xl md:text-5xl font-extrabold mb-1">{stat.value}</p>
              <p className="text-lg md:text-xl font-medium opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveStats;