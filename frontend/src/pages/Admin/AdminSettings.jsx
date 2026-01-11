// pages/admin/AdminSettings.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSessionStore } from '../../store/useSessionStore';
import MenuItemCard from '../../components/admin/menu/MenuItemCard';
import CreateMenuItem from '../../components/admin/menu/CreateMenuItem';
import EditMenuItem from '../../components/admin/menu/EditMenuItem';
import DeleteMenuItem from '../../components/admin/menu/DeleteMenuItem';
import MenuFilters from '../../components/admin/menu/MenuFilters';
import AdminNav from '../../components/admin/AdminNav';

import { 
  fetchMenuItems, 
  toggleMenuItemAvailability 
} from '../../api/adminMenuAPI';

export default function AdminSettings() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const hotelId = useSessionStore((s) => s.hotelId);

  useEffect(() => {
    loadMenuItems();
  }, [hotelId]);

  const loadMenuItems = async () => {
    setLoading(true);
    try {
      const response = await fetchMenuItems(hotelId);
      console.log('📦 API Response:', response); // ✅ Debug
      if (response.success) {
        console.log('📦 Menu Items:', response.data); // ✅ Debug
        console.log('📦 First Item Category:', response.data[0]?.category); // ✅ Debug
        setMenuItems(response.data);
      }
    } catch (error) {
      console.error('Failed to load menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Extract category names as STRINGS
  const categories = useMemo(() => {
    const cats = [...new Set(
      menuItems
        .map(item => {
          console.log('🔍 Item category:', item.category); // ✅ Debug
          return item.category?.name;  // Extract name string
        })
        .filter(Boolean)  // Remove null/undefined
    )];
    console.log('📋 Categories (should be strings):', cats); // ✅ Debug
    console.log('📋 Categories types:', cats.map(c => typeof c)); // ✅ Debug
    return ['all', ...cats];
  }, [menuItems]);

  // Filter items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        categoryFilter === 'all' || 
        item.category?.name === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchQuery, categoryFilter]);

  const handleToggleAvailability = async (item) => {
    try {
      const response = await toggleMenuItemAvailability(item._id, !item.isAvailable);
      if (response.success) {
        setMenuItems(prev => prev.map(i => 
          i._id === item._id ? { ...i, isAvailable: !i.isAvailable } : i
        ));
      }
    } catch (error) {
      console.error('Failed to toggle availability:', error);
      alert('Failed to update item availability');
    }
  };

  const handleItemCreated = (newItem) => {
    setMenuItems(prev => [newItem, ...prev]);
    setShowCreateModal(false);
  };

  const handleItemUpdated = (updatedItem) => {
    setMenuItems(prev => prev.map(item => 
      item._id === updatedItem._id ? updatedItem : item
    ));
    setEditingItem(null);
  };

  const handleItemDeleted = (itemId) => {
    setMenuItems(prev => prev.filter(item => item._id !== itemId));
    setDeletingItem(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/60">Loading menu items...</p>
        </div>
      </div>
    );
  }

  // ✅ Debug before render
  console.log('🎨 Rendering with:');
  console.log('  - Categories:', categories);
  console.log('  - CategoryFilter:', categoryFilter, typeof categoryFilter);
  console.log('  - MenuItems count:', menuItems.length);
  console.log('  - FilteredItems count:', filteredItems.length);

  return (
    <>
      <AdminNav />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Menu Management</h1>
              <p className="text-white/60">Manage your restaurant menu items</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              Add New Item
            </motion.button>
          </div>

          {/* Filters */}
          <MenuFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            categories={categories}
            totalItems={menuItems.length}
            filteredCount={filteredItems.length}
            availableCount={menuItems.filter(i => i.isAvailable).length}
          />
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item._id}
                item={item}
                onEdit={() => setEditingItem(item)}
                onDelete={() => setDeletingItem(item)}
                onToggleAvailability={() => handleToggleAvailability(item)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlassIcon className="w-12 h-12 text-white/30" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No items found</h3>
            <p className="text-white/60">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Modals */}
        <AnimatePresence>
          {showCreateModal && (
            <CreateMenuItem
              onClose={() => setShowCreateModal(false)}
              onSuccess={handleItemCreated}
              hotelId={hotelId}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {editingItem && (
            <EditMenuItem
              item={editingItem}
              onClose={() => setEditingItem(null)}
              onSuccess={handleItemUpdated}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {deletingItem && (
            <DeleteMenuItem
              item={deletingItem}
              onClose={() => setDeletingItem(null)}
              onSuccess={handleItemDeleted}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
