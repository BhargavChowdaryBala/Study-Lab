import React from 'react';

export const ProgressBar = ({ percentage = 0, size = 'md', showLabel = true, color = 'brand' }) => {
  const clamped = Math.min(100, Math.max(0, Math.round(percentage)));

  const sizeHeights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorGradients = {
    brand: clamped === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-brand-500 to-indigo-600',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    amber: 'bg-gradient-to-r from-amber-400 to-orange-500',
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${sizeHeights[size] || sizeHeights.md}`}>
        <div
          className={`${sizeHeights[size] || sizeHeights.md} rounded-full transition-all duration-500 ease-out ${
            colorGradients[color] || colorGradients.brand
          }`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-slate-500 mt-1 font-medium">
          <span>{clamped === 100 ? 'Completed' : 'In Progress'}</span>
          <span>{clamped}%</span>
        </div>
      )}
    </div>
  );
};

