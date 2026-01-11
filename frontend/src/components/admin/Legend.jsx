// Legend.jsx
import React from "react";

export default function Legend({ className = "" }) {
  const items = [
    { label: "Available", color: "bg-slate-800/90" },
    { label: "Occupied", color: "bg-blue-800/90" },
    { label: "Cooking", color: "bg-orange-800/90" },
    { label: "Reserved", color: "bg-purple-800/90" },
  ];

  return (
    <div className={`flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-white/80 ${className}`}>
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
          <div className={`w-4 h-2 sm:w-6 sm:h-3 rounded ${it.color} border border-white/6 flex-shrink-0`} />
          <div className="text-xs sm:text-sm">{it.label}</div>
        </div>
      ))}
    </div>
  );
}
