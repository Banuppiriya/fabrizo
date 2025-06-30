// src/pages/Adminpanel.jsx

import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import ServicesAdmin from '../pages/ServicesAdmin';
import OrdersAdmin from '../pages/OrdersAdmin';

const activeClass = 'flex items-center p-3 rounded-lg bg-indigo-600 text-white font-semibold';
const inactiveClass = 'flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition duration-200';

const Adminpanel = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-sm text-gray-400">Fabrizo Management</p>
        </div>
        <nav className="flex-grow">
          <ul>
            <li className="mb-2">
              <NavLink to="/admin/services" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
                Services
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink to="/admin/orders" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
                Orders
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink to="/admin/tailors" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
                Tailors
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink to="/admin/customers" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
                Customers
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink to="/admin/inventory" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
                Inventory
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink to="/admin/payments" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
                Payments
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col">
        <main className="p-6 flex-grow">
          <Routes>
            <Route path="/admin/services" element={<ServicesAdmin />} />
            <Route path="/admin/orders" element={<OrdersAdmin />} />
            {/* Add more routes like TailorsAdmin, etc. */}
            <Route path="*" element={<div>Select an option from the sidebar</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Adminpanel;
