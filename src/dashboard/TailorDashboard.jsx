// TailorDashboard.jsx
import React from 'react';

const TailorDashboard = () => {
  const currentAssignments = [
    {
      id: '963245',
      type: 'Business Suit - Dark Grey',
      dueDate: '2024-01-28',
      progress: 75,
      deliveryMethod: 'Home Delivery',
      shippingAddress: '2345, Rosemead Ave, Rosemead, CA',
      payment: 'Paid',
      price: '$1200',
    },
    {
      id: '963246',
      type: 'Evening Dress - Navy Blue',
      dueDate: '2024-02-10',
      progress: 40,
      deliveryMethod: 'Pickup',
      pickupLocation: 'Fabrizo Downtown Store',
      payment: 'Paid',
      price: '$850',
    },
  ];

  const recentCompletions = [
    { id: '12343', client: 'John Doe', item: 'Tuxedo', date: '2024-01-10', rating: 4.5 },
    { id: '12340', client: 'Jane Smith', item: 'Dress', date: '2024-01-05', rating: 5 },
    { id: '12339', client: 'Alex Lee', item: 'Shirt', date: '2024-01-02', rating: 4 },
  ];

  const calculateDaysLeft = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? `${diff} day${diff !== 1 ? 's' : ''} left` : 'Overdue';
  };

  return (
    <div className="flex min-h-screen bg-gray-900 font-sans text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-8">Fabrizo</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <a className="flex items-center p-3 rounded-lg bg-indigo-600 text-white font-semibold" href="#">
                <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-grow relative" style={{
        backgroundImage: "url('https://via.placeholder.com/1200x800/222222/cccccc?text=Tailor+Workspace+Background')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div className="absolute inset-0 bg-gray-900 opacity-80"></div>

        <header className="relative z-10 bg-gray-900 bg-opacity-70 backdrop-blur-sm py-4 px-6 flex justify-between items-center">
          <div className="flex items-center space-x-6 text-gray-300">
            <span className="text-2xl font-bold text-indigo-400">Fabrizo</span>
            <a href="#" className="hover:text-indigo-400">Home</a>
            <a href="#" className="hover:text-indigo-400">Services</a>
            <a href="#" className="hover:text-indigo-400">Design Customizer</a>
            <a href="#" className="text-indigo-400 font-semibold">Track Orders</a>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2 2 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </div>
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <svg className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-gray-300 font-medium">John Doe</span>
          </div>
        </header>

        <main className="relative z-10 p-6">
          <h1 className="text-3xl font-bold text-white mb-2">Tailor Dashboard</h1>
          <p className="text-gray-300 mb-8">Manage your assignments and track your craftsmanship</p>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Jobs in Queue', value: 8, color: 'indigo' },
              { label: 'Completed', value: 156, color: 'green' },
              { label: 'Rating', value: '4.9', color: 'yellow' },
              { label: 'This Month', value: '$12,450', color: 'purple' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg shadow-lg p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{item.label}</p>
                  <h3 className="text-3xl font-bold text-white">{item.value}</h3>
                </div>
                <div className={`bg-${item.color}-600 p-3 rounded-full`}>
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Current Assignments */}
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Current Assignments</h2>
            {currentAssignments.map((assignment) => (
              <div key={assignment.id} className="border border-gray-700 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Order #{assignment.id} - {assignment.type}</h3>
                    <p className="text-sm text-gray-400">Due Date: {assignment.dueDate}</p>
                  </div>
                  <span className="text-sm font-semibold text-indigo-400 bg-indigo-900 px-3 py-1 rounded-full">In Progress</span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-4 text-sm text-gray-300 mb-4">
                  <div>
                    <p className="font-medium">Delivery Method:</p>
                    <p>{assignment.deliveryMethod}</p>
                  </div>
                  <div>
                    <p className="font-medium">Address/Pickup:</p>
                    <p>{assignment.shippingAddress || assignment.pickupLocation}</p>
                  </div>
                  <div>
                    <p className="font-medium">Payment:</p>
                    <p>{assignment.payment}</p>
                  </div>
                  <div>
                    <p className="font-medium">Price:</p>
                    <p>{assignment.price}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${assignment.progress}%` }}></div>
                </div>
                <div className="flex justify-between text-sm text-gray-400 mb-4">
                  <span>{assignment.progress}% Progress</span>
                  <span>{calculateDaysLeft(assignment.dueDate)}</span>
                </div>
                <div className="flex space-x-3">
                  <button className="flex-1 py-2 px-4 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700">Manage Progress</button>
                  <button className="flex-1 py-2 px-4 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">View Details</button>
                  <button className="flex-1 py-2 px-4 rounded-md bg-green-600 text-white hover:bg-green-700">Submit Assignment</button>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Completions */}
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Recent Completions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    {['Order ID', 'Client', 'Item', 'Date', 'Rating'].map((header, i) => (
                      <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {recentCompletions.map((comp) => (
                    <tr key={comp.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">#{comp.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{comp.client}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{comp.item}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{comp.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex items-center">
                          {comp.rating}
                          <svg className="h-4 w-4 ml-1 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.329 1.176l1.07 3.292c.3.921-.755 1.688-1.539 1.175l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.513-1.838-.254-1.539-1.175l1.07-3.292a1 1 0 00-.329-1.176l-2.8-2.034c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TailorDashboard;
