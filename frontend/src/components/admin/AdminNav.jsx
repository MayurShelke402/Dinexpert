// components/admin/AdminNav.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Squares2X2Icon, 
  ChartBarIcon, 
  ClockIcon, 
  CogIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

export default function AdminNav() {
  const location = useLocation();
  
  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: Squares2X2Icon,
      description: 'Live orders & tables'
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: ChartBarIcon,
      description: 'Revenue & insights'
    },
    {
      name: 'Order History',
      path: '/admin/orders',
      icon: ClockIcon,
      description: 'Past orders & reports'
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: CogIcon,
      description: 'Configuration'
    }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-slate-800/90 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-white font-bold text-lg">Admin Panel</span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative px-4 py-2 rounded-lg transition-all duration-200 group
                      ${active 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {item.description}
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <button className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white hover:bg-red-500/10 rounded-lg transition-all">
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
