// CustomizerPage.jsx
import React, { useState } from 'react';

const Customizer = () => {
  const [designDescription, setDesignDescription] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quickMeasurements, setQuickMeasurements] = useState({
    chest: '38',
    waist: '32',
    shoulder: '18',
  });
  const [showDetailedMeasurements, setShowDetailedMeasurements] = useState(false);

  const [selectedGarmentType, setSelectedGarmentType] = useState('suit');
  const [fabricType, setFabricType] = useState('');
  const [selectedColor, setSelectedColor] = useState('#8B5CF6');
  const [buildType, setBuildType] = useState('');
  const [designImages, setDesignImages] = useState([]);
  const [preferredDeliveryDate, setPreferredDeliveryDate] = useState('');

  const handleQuickMeasurementChange = (field, value) => {
    setQuickMeasurements((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDesignImageChange = (event) => {
    const newFiles = Array.from(event.target.files).map(file => file.name);
    setDesignImages(prev => [...prev, ...newFiles]);
  };

  const handleClearDesignImages = () => {
    setDesignImages([]);
  };

  const handleSaveDesign = () => {
    console.log('Saving Design:', {
      designDescription,
      specialInstructions,
      quickMeasurements,
      selectedGarmentType,
      fabricType,
      selectedColor,
      buildType,
      designImages,
      preferredDeliveryDate,
    });
    alert('Design saved!');
  };

  const handlePlaceCustomOrder = () => {
    console.log('Placing Custom Order:', {
      designDescription,
      specialInstructions,
      quickMeasurements,
      selectedGarmentType,
      fabricType,
      selectedColor,
      buildType,
      designImages,
      preferredDeliveryDate,
    });
    alert('Custom order placed successfully!');
  };

  const handleRequestConsultation = () => {
    console.log('Requesting Consultation:', {
      designDescription,
      specialInstructions,
      selectedGarmentType,
      fabricType,
      selectedColor,
      buildType,
      designImages,
    });
    alert('Consultation requested. We will contact you soon!');
  };

  const colors = [
    '#EF4444', '#F97316', '#EAB308', '#22C55E', '#0EA5E9',
    '#3B82F6', '#8B5CF6', '#EC4899', '#4B5563', '#000000', '#FFFFFF',
  ];

  return (
    <div className="min-h-screen font-sans text-gray-100 flex flex-col">
      <nav className="bg-white bg-opacity-90 shadow-sm py-4 px-6 flex items-center justify-between z-20">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-indigo-600 mr-8">Fabrizo</span>
          <div className="hidden md:flex space-x-6 text-gray-700">
            <a href="#" className="hover:text-indigo-600">Home</a>
            <a href="#" className="font-semibold text-indigo-600">Design Customizer</a>
            <a href="#" className="hover:text-indigo-600">Track Orders</a>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-gray-700 font-medium">John Doe</span>
        </div>
      </nav>

      <main
        className="flex-grow flex flex-col items-center p-6"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div className="w-full max-w-6xl text-gray-100 relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">Design Customizer</h1>
          <p className="text-gray-300 mb-8">Upload your design images and customize your perfect garment.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Upload Images */}
              <div className="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Upload Your Design Images</h2>
                <div className="w-full bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg p-10 text-center mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6a5 5 0 011 9.9M15 13l-3-3-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-300 mb-2">Drag & Drop Your Design here</p>
                  <input type="file" multiple className="hidden" id="fileUpload" onChange={handleDesignImageChange} />
                  <label htmlFor="fileUpload" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700">Choose Files</label>
                </div>
                {designImages.length > 0 && (
                  <div className="w-full text-sm text-gray-300 mb-4">
                    <p className="font-semibold mb-2">Uploaded Files:</p>
                    <ul className="list-disc list-inside">
                      {designImages.map((file, index) => <li key={index}>{file}</li>)}
                    </ul>
                  </div>
                )}
                <div className="flex space-x-4 w-full">
                  <button className="flex-1 py-2 px-4 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700">+ Add More</button>
                  <button className="flex-1 py-2 px-4 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700" onClick={handleClearDesignImages}>Clear</button>
                  <button className="flex-1 py-2 px-4 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700">Organize</button>
                </div>
              </div>

              {/* Description + Instructions */}
              <div className="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Design Description</h3>
                <textarea
                  rows="4"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Describe your design, specify measurements, fabric, style preferences..."
                  value={designDescription}
                  onChange={(e) => setDesignDescription(e.target.value)}
                />
              </div>

              <div className="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Special Instructions</h3>
                <textarea
                  rows="3"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Any special instructions for the tailor..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>
            </div>

            {/* Options Column */}
            <div className="space-y-6">
              {/* Garment Type */}
              <div className="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Garment Type</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['suit', 'shirt', 'trouser', 'other'].map(type => (
                    <button
                      key={type}
                      className={`py-2 px-4 rounded-md font-medium ${
                        selectedGarmentType === type ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      onClick={() => setSelectedGarmentType(type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric & Color */}
              <div className="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Fabric & Color</h3>
                <select
                  className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded-md text-white"
                  value={fabricType}
                  onChange={(e) => setFabricType(e.target.value)}
                >
                  <option value="">Select Fabric</option>
                  <option value="cotton">Cotton</option>
                  <option value="wool">Wool</option>
                  <option value="silk">Silk</option>
                  <option value="linen">Linen</option>
                  <option value="polyester">Polyester</option>
                </select>
                <div className="flex flex-wrap gap-2 mb-4">
                  {colors.map((color, idx) => (
                    <div
                      key={idx}
                      className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                        selectedColor === color ? 'border-white ring-2 ring-indigo-400' : 'border-gray-700'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  ))}
                </div>
                <select
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  value={buildType}
                  onChange={(e) => setBuildType(e.target.value)}
                >
                  <option value="">Select Build</option>
                  <option value="slim">Slim Fit</option>
                  <option value="regular">Regular Fit</option>
                  <option value="loose">Loose Fit</option>
                </select>
              </div>

              {/* Measurements */}
              <div className="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl p-6">
                <h3 className="text-lg font-semibold mb-3 text-white">Quick Measurements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['chest', 'waist', 'shoulder'].map(measure => (
                    <div key={measure}>
                      <label className="block text-sm mb-1 capitalize">{measure} (in)</label>
                      <input
                        type="number"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        value={quickMeasurements[measure]}
                        onChange={(e) => handleQuickMeasurementChange(measure, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    checked={showDetailedMeasurements}
                    onChange={(e) => setShowDetailedMeasurements(e.target.checked)}
                  />
                  <label className="ml-2 text-sm">Detailed Measurements</label>
                </div>
              </div>

              {/* Delivery Date */}
              <div className="bg-gray-800 bg-opacity-70 rounded-lg shadow-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Delivery Preferences</h3>
                <input
                  type="date"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                  value={preferredDeliveryDate}
                  onChange={(e) => setPreferredDeliveryDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            <button onClick={handleSaveDesign} className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Design</button>
            <button onClick={handlePlaceCustomOrder} className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600">Place Custom Order</button>
            <button onClick={handleRequestConsultation} className="w-full py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700">Request Consultation</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Customizer;
