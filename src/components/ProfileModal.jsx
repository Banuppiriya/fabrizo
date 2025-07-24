import React from 'react';

const ProfileModal = ({ open, onClose, children }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex ${open ? '' : 'pointer-events-none'} transition-all duration-300`}
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      {/* Slide-in panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="p-8 overflow-y-auto h-full">{children}</div>
      </div>
    </div>
  );
};

export default ProfileModal;
