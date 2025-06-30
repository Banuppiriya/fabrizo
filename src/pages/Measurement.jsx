import React, { useState } from 'react';

// Reusable component for input sections
const MeasurementInputGroup = ({ title, section, data, onChange }) => (
  <div>
    <h3 className="font-semibold text-lg text-gray-700 mb-4">{title}</h3>
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between">
          <label htmlFor={key} className="capitalize text-gray-600 w-1/2">
            {key.replace(/([A-Z])/g, ' $1')}:
          </label>
          <div className="relative w-1/2 max-w-sm">
            <input
              type="number"
              id={`${section}-${key}`}
              name={key}
              value={value}
              onChange={(e) => onChange(section, key, e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              min="0"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">in</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Measurement = () => {
  const [measurements, setMeasurements] = useState({
    upperBody: {
      chest: '40',
      shoulderWidth: '18',
      armLength: '24',
      bicep: '14',
      neck: '16',
    },
    lowerBody: {
      waist: '34',
      hip: '38',
      inseam: '32',
      thigh: '22',
      height: '72',
    },
  });

  const handleMeasurementChange = (section, field, value) => {
    setMeasurements((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSaveMeasurements = () => {
    console.log('Saving measurements:', measurements);
    alert('Measurements saved successfully!');
  };

  const handleCancel = () => {
    console.log('Operation cancelled.');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <nav className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-indigo-600 mr-8">Fabrizo</span>
          <div className="hidden md:flex space-x-6 text-gray-700">
            <a href="#" className="hover:text-indigo-600">Home</a>
            <a href="#" className="hover:text-indigo-600">Services</a>
            <a href="#" className="hover:text-indigo-600">Design Customizer</a>
            <a href="#" className="font-semibold text-indigo-600">Track Orders</a>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-gray-700">John Doe</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Measurements</h1>
        <p className="text-gray-600 mb-8">Manage your body measurements for perfect fitting garments.</p>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Profile Section */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Default Profile</h2>
              <p className="text-sm text-gray-500">Last updated Jan 10, 2024</p>
            </div>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition">
              + New Profile
            </button>
          </div>

          {/* Measurements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
            <MeasurementInputGroup
              title="Upper Body"
              section="upperBody"
              data={measurements.upperBody}
              onChange={handleMeasurementChange}
            />
            <MeasurementInputGroup
              title="Lower Body"
              section="lowerBody"
              data={measurements.lowerBody}
              onChange={handleMeasurementChange}
            />
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-8">
            <h3 className="font-semibold text-blue-800 text-lg mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9.293 11.293a1 1 0 001.414 1.414L12 10.414l1.293 1.293a1 1 0 001.414-1.414L13.414 9l1.293-1.293a1 1 0 00-1.414-1.414L12 7.586l-1.293-1.293a1 1 0 00-1.414 1.414L10.586 9l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Measurement Tips
            </h3>
            <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
              <li>Measure over well-fitting undergarments</li>
              <li>Keep the tape measure parallel to the floor</li>
              <li>Don't pull the tape too tight</li>
              <li>Get help for more accurate results</li>
              <li>Measure at the end of the day</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              onClick={handleSaveMeasurements}
            >
              Save Measurements
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Measurement;
