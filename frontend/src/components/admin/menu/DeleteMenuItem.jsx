// components/admin/menu/DeleteMenuItem.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { deleteMenuItem } from '../../../api/adminAPI';

export default function DeleteMenuItem({ item, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await deleteMenuItem(item._id);
      
      if (response.success) {
        onSuccess(item._id);
      } else {
        throw new Error(response.message || 'Failed to delete item');
      }
    } catch (err) {
      console.error('Error deleting menu item:', err);
      setError(err.message || 'Failed to delete menu item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* Header with Warning Icon */}
        <div className="p-6">
          <div className="w-16 h-16 bg-red-500/20 border-2 border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-2">
            Delete Menu Item?
          </h2>
          <p className="text-white/60 text-center text-sm mb-6">
            This action cannot be undone. This will permanently delete the item from your menu.
          </p>

          {/* Item Preview */}
          <div className="bg-slate-700/50 border border-white/10 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4">
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-slate-600/50 rounded-lg flex items-center justify-center">
                  <TrashIcon className="w-8 h-8 text-white/30" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate">{item.name}</h3>
                <p className="text-white/60 text-sm">
                  {item.category?.name || 'No Category'}
                </p>
                <p className="text-green-400 font-bold mt-1">₹{item.price}</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-slate-700/50 border border-white/10 text-white rounded-lg font-medium hover:bg-slate-700/70 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <TrashIcon className="w-5 h-5" />
                  Delete Item
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
