import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaReceipt,
  FaChartBar,
  FaProjectDiagram,
  FaFileInvoice,
  FaUsers
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FaTachometerAlt, roles: ['Admin', 'FinanceChair', 'Treasurer', 'Secretary', 'Viewer'] },
    { name: 'Transactions', path: '/transactions', icon: FaReceipt, roles: ['Admin', 'FinanceChair', 'Treasurer', 'Secretary'] },
    { name: 'Budgets', path: '/budgets', icon: FaChartBar, roles: ['Admin', 'FinanceChair', 'Treasurer'] },
    { name: 'Projects', path: '/projects', icon: FaProjectDiagram, roles: ['Admin', 'FinanceChair', 'Treasurer', 'Secretary'] },
    { name: 'Obligations', path: '/obligations', icon: FaFileInvoice, roles: ['Admin', 'FinanceChair', 'Treasurer'] },
    { name: 'Reports', path: '/reports', icon: FaChartBar, roles: ['Admin', 'FinanceChair', 'Treasurer', 'Secretary', 'Viewer'] },
    { name: 'Province Statement', path: '/province-statement', icon: FaUsers, roles: ['Admin', 'FinanceChair', 'Treasurer', 'Secretary'] },
  ];

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(user?.role)
  );

  return (
    <div className={`bg-gray-800 text-white h-screen ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white focus:outline-none"
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>
      <nav className="mt-5">
        <ul>
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-4 hover:bg-gray-700 ${
                    isActive ? 'bg-gray-900 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <Icon className="text-xl" />
                  {!collapsed && (
                    <span className="ml-4">{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;