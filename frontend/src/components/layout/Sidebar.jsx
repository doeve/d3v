import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaWallet, 
  FaExchangeAlt, 
  FaFlask, 
  FaChartLine, 
  FaCog, 
  FaShieldAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useUI } from '../../hooks/useUI';
import { useAuth } from '../../hooks/useAuth';
import BlockchainSelector from '../common/BlockchainSelector';

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useUI();
  const { user } = useAuth();
  
  const isAdmin = user?.isAdmin;
  
  return (
    <aside 
      className={`fixed h-full bg-white dark:bg-gray-800 shadow-lg z-30 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <img 
            src="/assets/images/logo.svg" 
            alt="D3V" 
            className="h-8 w-8"
          />
          {sidebarOpen && (
            <h1 className="ml-2 text-xl font-bold text-blue-600 dark:text-blue-400">D3V</h1>
          )}
        </div>
        <button 
          className="p-1 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      
      <div className="py-4">
        <nav>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => 
              `flex items-center py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 ${
                isActive ? 'bg-blue-100 dark:bg-blue-900/50 border-r-4 border-blue-500' : ''
              }`
            }
          >
            <FaHome className="w-5 h-5" />
            {sidebarOpen && <span className="ml-4">Dashboard</span>}
          </NavLink>
          
          <NavLink
            to="/wallets"
            className={({ isActive }) => 
              `flex items-center py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 ${
                isActive ? 'bg-blue-100 dark:bg-blue-900/50 border-r-4 border-blue-500' : ''
              }`
            }
          >
            <FaWallet className="w-5 h-5" />
            {sidebarOpen && <span className="ml-4">Wallets</span>}
          </NavLink>
          
          <NavLink
            to="/copy-trade"
            className={({ isActive }) => 
              `flex items-center py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 ${
                isActive ? 'bg-blue-100 dark:bg-blue-900/50 border-r-4 border-blue-500' : ''
              }`
            }
          >
            <FaExchangeAlt className="w-5 h-5" />
            {sidebarOpen && <span className="ml-4">Copy Trading</span>}
          </NavLink>
          
          <NavLink
            to="/simulation"
            className={({ isActive }) => 
              `flex items-center py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 ${
                isActive ? 'bg-blue-100 dark:bg-blue-900/50 border-r-4 border-blue-500' : ''
              }`
            }
          >
            <FaFlask className="w-5 h-5" />
            {sidebarOpen && <span className="ml-4">Simulation</span>}
          </NavLink>
          
          <NavLink
            to="/analytics"
            className={({ isActive }) => 
              `flex items-center py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 ${
                isActive ? 'bg-blue-100 dark:bg-blue-900/50 border-r-4 border-blue-500' : ''
              }`
            }
          >
            <FaChartLine className="w-5 h-5" />
            {sidebarOpen && <span className="ml-4">Analytics</span>}
          </NavLink>
          
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) => 
                `flex items-center py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 ${
                  isActive ? 'bg-blue-100 dark:bg-blue-900/50 border-r-4 border-blue-500' : ''
                }`
              }
            >
              <FaShieldAlt className="w-5 h-5" />
              {sidebarOpen && <span className="ml-4">Admin</span>}
            </NavLink>
          )}
          
          <NavLink
            to="/settings"
            className={({ isActive }) => 
              `flex items-center py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 ${
                isActive ? 'bg-blue-100 dark:bg-blue-900/50 border-r-4 border-blue-500' : ''
              }`
            }
          >
            <FaCog className="w-5 h-5" />
            {sidebarOpen && <span className="ml-4">Settings</span>}
          </NavLink>
        </nav>
      </div>
      
      {sidebarOpen && (
        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
          <BlockchainSelector />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;