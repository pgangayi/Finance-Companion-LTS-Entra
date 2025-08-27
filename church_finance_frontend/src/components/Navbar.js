import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt, FaBell } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Church Finance</h1>
            </div>
          </div>
          <div className="flex items-center">
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
              <FaBell className="h-6 w-6" />
            </button>
            <div className="ml-3 relative">
              <div className="flex items-center">
                <div className="text-sm mr-3">
                  <p className="font-medium text-gray-700">{user?.name}</p>
                  <p className="text-gray-500 text-xs">{user?.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center text-sm text-gray-700 hover:text-gray-900"
                >
                  <FaSignOutAlt className="mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;