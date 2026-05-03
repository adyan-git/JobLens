import React from 'react';

export default function Navbar({ view, setView }) {
  const navigationMenuList = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <nav className="bg-[#1a1a1a] text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
      
      <div className="flex items-center">
        <h1 className="text-2xl font-bold tracking-wide">JobLens</h1>
      </div>

      
      <div className="flex space-x-4">
        {navigationMenuList.map((navItem) => (
          <button
            key={navItem.id}
            onClick={() => setView(navItem.id)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
              view === navItem.id
                ? 'bg-[#E35E28] text-white font-medium shadow-md'
                : 'text-gray-300 hover:bg-[#333333] hover:text-white'
            }`}
          >
            {navItem.label}
          </button>
        ))}
      </div>

      
      <div>
        <button 
          className="bg-white text-black hover:bg-gray-200 font-medium px-4 py-2 rounded-lg transition-colors duration-200"
        >
          + Log a Job
        </button>
      </div>
    </nav>
  );
}
