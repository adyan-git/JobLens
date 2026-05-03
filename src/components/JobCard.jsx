import React from 'react';

export default function JobCard({ company, role, status, techStuffArray = [], url }) {
  const getColorForStatusLabel = (status) => {
    switch (status) {
      case 'Applied': 
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Interview': 
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Rejected': 
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Offer': 
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Apply Later': 
      default: 
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div 
      className="bg-[#1a1a1a] rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-colors shadow-sm flex flex-col h-full"
    >
      
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-white text-lg">{company}</h3>
        <span 
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getColorForStatusLabel(status)}`}
        >
          {status}
        </span>
      </div>

      
      <div className="mb-4 flex-1">
        <p className="text-gray-300 font-medium mb-3">{role}</p>
        
        <div className="flex flex-wrap gap-2">
          {techStuffArray.map((techItem, i) => (
            <span 
              key={i} 
              className="bg-[#2a2a2a] text-gray-300 text-xs px-3 py-1 rounded-full"
            >
              {techItem}
            </span>
          ))}
        </div>
      </div>

      
      <div className="flex space-x-3 mt-auto pt-4 border-t border-gray-800">
        <button 
          className="flex-1 bg-white text-black hover:bg-gray-200 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          View Job
        </button>
        <button 
          className="flex-1 bg-[#333333] hover:bg-[#444444] text-white py-2 rounded-lg text-sm font-medium transition-colors border border-[#555555]"
        >
          View Notes
        </button>
      </div>

    </div>
  );
}
