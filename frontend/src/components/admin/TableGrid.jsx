// TableGrid.jsx - Updated with Table Action Handler
import React, { useState, useMemo } from "react";
import TableCard from "./TableCard";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, Squares2X2Icon } from "@heroicons/react/24/outline";

export default function TableGrid({ tables = [], onSelectTable, selectedTableId, onTableAction }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // ✅ Handler to pass to TableCard
  const handleStatusChange = (table, newStatus) => {
    if (onTableAction) {
      onTableAction(table, newStatus);
    }
  };

  // Safe filter logic
  const filteredTables = useMemo(() => {
    try {
      if (!Array.isArray(tables)) return [];

      return tables.filter(table => {
        if (!table) return false;

        let searchMatch = true;
        if (searchQuery?.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const tableNumber = table.number?.toString() || "";
          const tableName = table.name?.toLowerCase() || "";
          const tableSeats = table.seats?.toString() || "";
          
          searchMatch = 
            tableNumber.includes(query) ||
            tableName.includes(query) ||
            tableSeats.includes(query);
        }

        let stateMatch = true;
        if (stateFilter !== "all") {
          if (stateFilter === "available") {
            stateMatch = !table.isOccupied;
          } else if (stateFilter === "occupied") {
            stateMatch = table.isOccupied && table.state !== 'cooking';
          } else {
            stateMatch = table.state === stateFilter;
          }
        }
        
        return searchMatch && stateMatch;
      });
    } catch (error) {
      console.error("Error filtering tables:", error);
      return [];
    }
  }, [tables, searchQuery, stateFilter]);

  // Professional stats
  const stats = useMemo(() => {
    try {
      if (!Array.isArray(tables)) return { total: 0, available: 0, occupied: 0, cooking: 0, reserved: 0 };

      return {
        total: tables.length,
        available: tables.filter(t => t && !t.isOccupied).length,
        occupied: tables.filter(t => t && t.isOccupied && t.state !== 'cooking').length,
        cooking: tables.filter(t => t && t.state === 'cooking').length,
        reserved: tables.filter(t => t && t.state === 'reserved').length,
      };
    } catch (error) {
      return { total: 0, available: 0, occupied: 0, cooking: 0, reserved: 0 };
    }
  }, [tables]);

  if (!tables || !Array.isArray(tables)) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/60 mx-auto mb-4"></div>
          <p className="text-white/60">Loading restaurant layout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Professional Header */}
      <div className="p-6 border-b border-white/10 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Squares2X2Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Floor Management</h2>
              <p className="text-sm text-white/60">Real-time table status overview</p>
            </div>
          </div>
          
          {/* Professional Stats */}
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-xs text-white/60 uppercase tracking-wide">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{stats.available}</div>
              <div className="text-xs text-emerald-400/60 uppercase tracking-wide">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.occupied}</div>
              <div className="text-xs text-blue-400/60 uppercase tracking-wide">Occupied</div>
            </div>
            {stats.cooking > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{stats.cooking}</div>
                <div className="text-xs text-orange-400/60 uppercase tracking-wide">Cooking</div>
              </div>
            )}
          </div>
        </div>

        {/* Professional Controls */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tables by number, name, or capacity..."
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-500/50 focus:bg-slate-700/80 transition-all"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white hover:bg-slate-700/80 transition-all min-w-[160px]"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              <span className="font-medium">
                {stateFilter === "all" ? "All States" :
                 stateFilter === "available" ? "Available" :
                 stateFilter === "occupied" ? "Occupied" :
                 stateFilter === "cooking" ? "Cooking" : "Reserved"}
              </span>
              <svg 
                className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showFilterDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(false)} />
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600/50 rounded-lg shadow-2xl z-20 overflow-hidden">
                  {[
                    { value: "all", label: "All States", color: "text-white" },
                    { value: "available", label: "Available", color: "text-emerald-400" },
                    { value: "occupied", label: "Occupied", color: "text-blue-400" },
                    { value: "cooking", label: "Cooking", color: "text-orange-400" },
                    { value: "reserved", label: "Reserved", color: "text-purple-400" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStateFilter(option.value);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-slate-700/50 transition-colors ${
                        stateFilter === option.value ? 'bg-slate-700/50' : ''
                      }`}
                    >
                      <span className={option.color}>{option.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Professional Grid */}
      <div className="flex-1 overflow-auto p-6">
        {filteredTables.length > 0 ? (
          <motion.div 
            layout
            className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
          >
            <AnimatePresence>
              {filteredTables.map((table) => {
                if (!table?._id) return null;
                
                return (
                  <motion.div
                    key={table._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TableCard
                      table={table}
                      onSelect={onSelectTable}
                      isSelected={selectedTableId === table._id}
                      onStatusChange={handleStatusChange} // ✅ Pass the handler to TableCard
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full"
          >
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mb-4">
              <MagnifyingGlassIcon className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No tables found</h3>
            <p className="text-white/60 text-center max-w-sm">
              {searchQuery ? 'Try adjusting your search criteria' : 'Tables will appear when loaded'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
