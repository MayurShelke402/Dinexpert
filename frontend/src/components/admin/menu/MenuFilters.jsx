// components/admin/menu/MenuFilters.jsx
import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function MenuFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  categories,
  totalItems,
  filteredCount,
  availableCount
}) {
  return (
    <div>
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search menu items..."
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="relative sm:w-64">
          <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer transition-all"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-slate-800">
                {cat === 'all' ? '📋 All Categories' : `🍽️ ${cat}`}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap gap-3">
        <div className="bg-slate-800/30 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span className="text-white/60 text-sm">Total: </span>
          <span className="text-white font-bold">{totalItems}</span>
        </div>
        
        <div className="bg-slate-800/30 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          <span className="text-white/60 text-sm">Filtered: </span>
          <span className="text-white font-bold">{filteredCount}</span>
        </div>
        
        <div className="bg-slate-800/30 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white/60 text-sm">Available: </span>
          <span className="text-green-400 font-bold">{availableCount}</span>
        </div>

        {searchQuery && (
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-4 py-2 flex items-center gap-2">
            <MagnifyingGlassIcon className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm">
              Searching: <span className="font-semibold">"{searchQuery}"</span>
            </span>
          </div>
        )}

        {categoryFilter !== 'all' && (
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg px-4 py-2 flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm">
              Category: <span className="font-semibold">{categoryFilter}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
