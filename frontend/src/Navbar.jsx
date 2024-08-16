import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-purple-600">PEOPLE.CO</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11c0-1.105-.89-2-2-2H8a2 2 0 00-2 2v3.159c0 .538-.214 1.054-.595 1.436L4 17h5"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v1a3 3 0 006 0v-1"></path>
              </svg>
            </button>
            <div className="flex items-center">
              <img
                className="w-8 h-8 rounded-full"
                src="https://via.placeholder.com/40"
                alt="Profile"
              />
              <span className="ml-2 text-gray-700">Jane Doe</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
