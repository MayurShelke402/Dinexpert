// components/admin/menu/CreateMenuItem.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, PhotoIcon, PlusIcon } from '@heroicons/react/24/outline';
import { createMenuItem } from '../../../api/adminMenuAPI';
import { getAllCategories } from '../../../api/categoriesAPI';

export default function CreateMenuItem({ onClose, onSuccess, hotelId }) {
  const [formData, setFormData] = useState({
    name: '',
    vegOrNonVeg: 'Veg',
    servingSize: '',
    price: '',
    description: '',
    category: '',
    isAvailable: true,
    timerequired: '',
  });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories from your categories API
  useEffect(() => {
    fetchCategories();
  }, [hotelId]);

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories(hotelId);
       if (Array.isArray(res)) {
          setCategories(res);
        } else if (res.data && Array.isArray(res.data)) {
          setCategories(res.data);
        } else if (res.categories && Array.isArray(res.categories)) {
          setCategories(res.categories);
        } else {
          setCategories([]);
        }
    } catch (e) {
      setCategories([]);
    }
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle images (multiple)
  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(files);
      const previews = [];
      files.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === files.length) setImagePreviews(previews);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Tags
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  const removeTag = tag => setTags(tags.filter(t => t !== tag));

  // Form submit for creating menu item
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('vegOrNonVeg', formData.vegOrNonVeg);
      formDataToSend.append('servingSize', formData.servingSize);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('isAvailable', formData.isAvailable);
      formDataToSend.append('hotel', hotelId);
      formDataToSend.append('tags', JSON.stringify(tags));
      formDataToSend.append('timerequired', formData.timerequired);
      imageFiles.forEach(f => formDataToSend.append('images', f));

      const response = await createMenuItem(formDataToSend);
      if (response.success) {
        onSuccess(response.data);
      } else {
        throw new Error(response.message || response.error || 'Failed to create item');
      }
    } catch (err) {
      setError(err.message || 'Failed to create menu item');
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
        onClick={e => e.stopPropagation()}
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-white/10 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Add New Menu Item</h2>
            <p className="text-white/60 text-sm mt-1">Create a new item for your menu</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-white/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Images */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Item Images *</label>
            <div className="flex gap-4 flex-wrap">
              {imagePreviews.map((preview, i) => (
                <img key={i} src={preview} className="w-20 h-20 rounded-lg" alt="" />
              ))}
            </div>
            <label className="cursor-pointer block mt-2">
              <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:border-blue-500/50 transition-colors">
                <PhotoIcon className="w-8 h-8 text-white/40 mx-auto mb-2" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <span className="text-white/60 text-sm">Click or drag to upload images</span>
              </div>
            </label>
          </div>

          {/* Basic Info */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Item Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none"
              placeholder="Item name"
            />
          </div>

          {/* Veg/Non-Veg */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Veg / Non-Veg *</label>
            <select
              name="vegOrNonVeg"
              value={formData.vegOrNonVeg}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg text-white"
            >
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg text-white"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Serving Size + Time Required */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Serving Size</label>
              <input
                type="text"
                name="servingSize"
                value={formData.servingSize}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg text-white"
                placeholder="e.g., 2 people"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Time Required</label>
              <input
                type="text"
                name="timerequired"
                value={formData.timerequired}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg text-white"
                placeholder="e.g., 30 mins"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg text-white"
              placeholder="0.00"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg text-white resize-none"
              placeholder="Describe your dish..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1 px-4 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white"
                placeholder="Add tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-300 rounded-lg"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="font-bold">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isAvailable"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label htmlFor="isAvailable" className="text-white/80 cursor-pointer">
              Available for orders
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-700/50 border border-white/10 text-white rounded-lg"
            >Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold"
            >{loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <PlusIcon className="w-5 h-5" />
                  Create Item
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
