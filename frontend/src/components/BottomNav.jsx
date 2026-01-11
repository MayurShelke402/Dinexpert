import { FaHome, FaUser, FaShoppingCart } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function BottomNav() {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/activeorders', icon: FaShoppingCart, label: 'Order' },
    { path: '/summary', icon: FaUser, label: 'Summary' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 flex justify-around items-center py-2 shadow-lg z-50">
      {navItems.map(({ path, icon: Icon, label }) => {
        const active = isActive(path);
        
        return (
          <Link key={path} to={path} className="relative flex flex-col items-center justify-center p-2">
            <motion.div
              className={`flex flex-col items-center justify-center transition-colors ${
                active ? 'text-green-600' : 'text-gray-500'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={22} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </motion.div>
            
            {/* Active indicator */}
            {active && (
              <motion.div
                layoutId="activeTab"
                className="absolute -top-1 w-8 h-1 bg-green-600 rounded-full"
                initial={false}
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
