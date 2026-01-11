// components/admin/menu/MenuItemCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function MenuItemCard({ item, onEdit, onDelete, onToggleAvailability }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-slate-800/50 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all group"
    >
      {/* Image */}
      <div className="relative h-48 bg-slate-700/50 overflow-hidden">
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PhotoIcon className="w-16 h-16 text-white/20" />
          </div>
        )}
        
        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <button
            onClick={onToggleAvailability}
            className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
              item.isAvailable
                ? 'bg-green-500/20 border-green-500/50 text-green-300'
                : 'bg-red-500/20 border-red-500/50 text-red-300'
            }`}
          >
            {item.isAvailable ? 'Available' : 'Out of Stock'}
          </button>
        </div>

        {/* Veg/Non-Veg Badge */}
        {item.vegOrNonVeg && (
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
              item.vegOrNonVeg === 'Veg' 
                ? 'bg-green-500/20 border-green-500/50 text-green-300'
                : 'bg-red-500/20 border-red-500/50 text-red-300'
            }`}>
              {item.vegOrNonVeg === 'Veg' ? '🟢' : '🔴'} {item.vegOrNonVeg}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{item.name}</h3>
            {/* ✅ FIX: Render category.name, not category object */}
            <p className="text-sm text-blue-400 mb-2">
              {item.category?.name || 'No Category'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-400">₹{item.price}</p>
          </div>
        </div>

        {item.description && (
          <p className="text-sm text-white/60 line-clamp-2 mb-4">{item.description}</p>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx}
                className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="px-2 py-0.5 text-blue-300 text-xs">
                +{item.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Serving Size & Time */}
        <div className="flex gap-2 text-xs text-white/50 mb-3">
          {item.servingSize && (
            <span className="flex items-center gap-1">
              👥 {item.servingSize}
            </span>
          )}
          {item.timerequired && (
            <span className="flex items-center gap-1">
              ⏱️ {item.timerequired}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
