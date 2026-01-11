// TableCard.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClockIcon,
  CheckCircleIcon,
  FireIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function TableCard({
  table,
  onSelect,
  isSelected,
  onStatusChange,
}) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  // Safe table shape
  const safeTable = {
    _id: table?._id || "unknown",
    number: table?.number || "N/A",
    seats: table?.seats || 1,
    isOccupied: table?.isOccupied || false,
    state: table?.state || "available",
    name: table?.name,
    currentOrder: table?.currentOrder,
  };

  // State configs
  const stateConfigs = {
    available: {
      bg: "bg-slate-800/90",
      border: "border-slate-600/50",
      accent: "bg-emerald-500",
      text: "text-white",
      icon: CheckCircleIcon,
      badgeText: "Available",
      badgeBg:
        "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    },
    occupied: {
      bg: "bg-blue-800/90",
      border: "border-blue-600/50",
      accent: "bg-blue-500",
      text: "text-white",
      icon: UserGroupIcon,
      badgeText: "Occupied",
      badgeBg: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    },
    cooking: {
      bg: "bg-orange-800/90",
      border: "border-orange-600/50",
      accent: "bg-orange-500",
      text: "text-white",
      icon: FireIcon,
      badgeText: "Cooking",
      badgeBg: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    },
    reserved: {
      bg: "bg-purple-800/90",
      border: "border-purple-600/50",
      accent: "bg-purple-500",
      text: "text-white",
      icon: ClockIcon,
      badgeText: "Reserved",
      badgeBg: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    },
  };

  const currentState =
    safeTable.state === "occupied" || safeTable.isOccupied
      ? "occupied"
      : safeTable.state || "available";

  const config = stateConfigs[currentState] || stateConfigs.available;
  const StateIcon = config.icon;

  // Items preview
  const itemsPreview = (() => {
    try {
      const items = safeTable.currentOrder?.items?.slice(0, 2) || [];
      return items.map((it) => {
        const name = it?.menuItem?.name || it?.name || "Item";
        const quantity = it?.quantity || 1;
        return { name, quantity };
      });
    } catch {
      return [];
    }
  })();

  const handleClick = () => {
    if (typeof onSelect === "function") {
      onSelect(safeTable);
    }
  };

  const handleStatusClick = (e, newStatus) => {
    e.stopPropagation();
    setShowStatusMenu(false);
    if (typeof onStatusChange === "function") {
      onStatusChange(table, newStatus);
    }
  };

  const toggleStatusMenu = () => {
    setShowStatusMenu((prev) => !prev);
  };

  // Show all statuses and highlight the current one
  const statusOptions = [
    {
      value: "available",
      label: "Available",
      icon: CheckCircleIcon,
      color: "text-emerald-400",
    },
    {
      value: "occupied",
      label: "Occupied",
      icon: UserGroupIcon,
      color: "text-blue-400",
    },
    {
      value: "reserved",
      label: "Reserved",
      icon: ClockIcon,
      color: "text-purple-400",
    },
    {
      value: "cooking",
      label: "Cooking",
      icon: FireIcon,
      color: "text-orange-400",
    },
  ];

  return (
    <motion.div
      layout
      whileHover={{
        scale: 1.02,
        y: -4,
        boxShadow:
          "0 20px 25px -5px rgba(0,0,0,0.3), 0 10px 10px -5px rgba(0,0,0,0.2)",
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`
        cursor-pointer relative overflow-visible rounded-xl border backdrop-blur-sm
        ${config.bg} ${config.border} ${config.text}
        shadow-lg hover:shadow-xl transition-all duration-300
        min-h-[140px] max-h-[140px]
      `}
    >
      {/* Accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${config.accent}`} />

      {/* Selection ring */}
      {isSelected && (
        <motion.div
          layoutId="selection"
          className="absolute inset-0 rounded-xl ring-2 ring-blue-400 ring-offset-2 ring-offset-transparent pointer-events-none"
        />
      )}

      {/* Content */}
      <div className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.accent} flex-shrink-0`}>
              <StateIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Table {safeTable.number}
              </h3>
              <p className="text-xs text-white/70 mt-0.5">
                {safeTable.seats} seat{safeTable.seats !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Status badge + dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleStatusMenu();
              }}
              className={`
                px-2.5 py-1 rounded-md text-xs font-medium
                ${config.badgeBg}
                hover:opacity-90
                transition-opacity
                flex items-center gap-1.5
              `}
            >
              {config.badgeText}
            </button>

            <AnimatePresence>
              {showStatusMenu && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    key="status-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.01 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setShowStatusMenu(false)}
                  />

                  {/* Dropdown */}
                  <motion.div
                    key="status-menu"
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="
                      absolute top-full right-0 mt-2
                      bg-slate-900/95
                      border border-slate-700/60
                      rounded-lg
                      shadow-xl shadow-slate-900/70
                      overflow-hidden
                      min-w-[160px]
                      z-50
                    "
                    onClick={(e) => e.stopPropagation()}
                  >
                    {statusOptions.map((option) => {
                      const OptionIcon = option.icon;
                      const isActive = option.value === currentState;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={(e) =>
                            handleStatusClick(e, option.value)
                          }
                          className={`
                            w-full flex items-center gap-2 px-3 py-2.5 text-left text-xs
                            hover:bg-slate-800/80
                            transition-colors
                            ${isActive ? "bg-slate-800/80" : ""}
                          `}
                        >
                          <OptionIcon
                            className={`w-4 h-4 ${option.color} shrink-0`}
                          />
                          <span
                            className={`
                              truncate
                              ${isActive ? "font-semibold" : "font-medium"}
                              ${option.color}
                            `}
                          >
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Order preview */}
        <div className="flex-1 min-h-0">
          {itemsPreview.length > 0 ? (
            <div className="space-y-1">
              <div className="text-xs font-medium text-white/90 mb-2">
                Current Order
              </div>
              {itemsPreview.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-white/80 truncate pr-2">
                    {item.name}
                  </span>
                  <span className="text-white/60 flex-shrink-0">
                    ×{item.quantity}
                  </span>
                </div>
              ))}
              {safeTable.currentOrder?.items?.length > 2 && (
                <div className="text-xs text-white/50 pt-1">
                  +{safeTable.currentOrder.items.length - 2} more
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-white/50 text-xs">No active orders</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
          <div className="text-xs text-white/60">
            {safeTable.isOccupied ? "In Use" : "Ready"}
          </div>
          {safeTable.currentOrder?.items?.length > 0 && (
            <div
              className={`px-2 py-1 rounded-full text-xs font-bold ${config.accent} text-white`}
            >
              {safeTable.currentOrder.items.length}
            </div>
          )}
        </div>
      </div>

      {/* Order count badge */}
      {safeTable.currentOrder?.items?.length > 0 && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white">
          {safeTable.currentOrder.items.length}
        </div>
      )}
    </motion.div>
  );
}
