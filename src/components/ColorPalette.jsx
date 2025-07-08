import React from 'react';

const colors = [
  {
    name: 'Primary Blue',
    description: 'Deep navy background on both sides',
    hex: '#1E1B45 to #2A2A5A',
    swatch: ['#1E1B45', '#2A2A5A'],
  },
  {
    name: 'Burnt Orange',
    description: 'Center panel and some fabric lighting',
    hex: '#B76E49 to #A04C2B',
    swatch: ['#B76E49', '#A04C2B'],
  },
  {
    name: 'Cream White',
    description: 'Neon script and mannequin light highlights',
    hex: '#FAF7F5 or slightly warmer',
    swatch: ['#FAF7F5'],
  },
  {
    name: 'Brown/Beige',
    description: 'Fabric spools, thread, buttons',
    hex: '#7B5C43, #D2B48C',
    swatch: ['#7B5C43', '#D2B48C'],
  },
  {
    name: 'Black/Charcoal',
    description: 'Outlines, shadows, tools',
    hex: '#111111 to #222222',
    swatch: ['#111111', '#222222'],
  },
];

const ColorPalette = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900">Color Palette</h1>
      <div className="space-y-8">
        {colors.map(({ name, description, hex, swatch }) => (
          <div key={name} className="flex items-center space-x-6">
            <div className="flex space-x-2">
              {swatch.map((color, idx) => (
                <div
                  key={idx}
                  className="w-16 h-16 rounded shadow-md border border-gray-300"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-800">{name}</h2>
              <p className="text-gray-700 font-normal">{description}</p>
              <p className="text-gray-600 italic mt-1">{hex}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;
