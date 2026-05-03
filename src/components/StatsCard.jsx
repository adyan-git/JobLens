import React from 'react';

export default function StatsCard({ 
  title, 
  value 
}) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 transition-transform duration-200 hover:scale-[1.02] hover:brightness-110 shadow-sm border border-gray-800">
      
      <div className="text-4xl font-bold text-white mb-2">
        {value}
      </div>
      
      <div className="text-sm font-medium text-gray-400">
        {title}
      </div>

    </div>
  );
}
