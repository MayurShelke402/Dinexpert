import { useEffect, useState } from 'react';
import { getHotelById } from '../api/hotelAPI';
import { useSessionStore } from '../store/useSessionStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHome } from 'react-icons/hi2';

export default function HotelHeader() {
  const [hotel, setHotel] = useState(null);
  const hotelId = useSessionStore((s) => s.hotelId);

  useEffect(() => {
    if (hotelId) {
      getHotelById(hotelId)
        .then((res) => setHotel(res.data))
        .catch((err) => console.error('Error fetching hotel details', err));
    }
  }, [hotelId]);

  if (!hotel) return null;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 shadow-lg border-b border-gray-100">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Hotel Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            {hotel.logo && (
              <div className="relative">
                <img
                  src={hotel.logo}
                  alt={hotel.name}
                  className="w-10 h-10 object-cover rounded-xl shadow-md border border-gray-200"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>
            )}
            
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                {hotel.name}
              </h1>
              <p className="text-gray-500 text-xs">Premium dining experience</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <HiHome className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </motion.nav>
        </div>
      </div>
    </header>
  );
}
