import React from 'react';

export default function Filters() {
  return (
    <div className="flex flex-wrap gap-6 bg-[#1a1a1a] p-5 rounded-xl border border-gray-800">
      
      <div className="flex flex-col space-y-1">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Filter by Role
        </label>
        <select 
          className="bg-[#2a2a2a] text-white border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#E35E28] min-w-[200px] transition-colors hover:border-gray-600"
        >
          <option>All Roles</option>
          <option>Frontend</option>
          <option>Backend</option>
          <option>Fullstack</option>
        </select>
      </div>
      
      <div className="flex flex-col space-y-1">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Filter by Status
        </label>
        <select 
          className="bg-[#2a2a2a] text-white border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#E35E28] min-w-[200px] transition-colors hover:border-gray-600"
        >
          <option>All Statuses</option>
          <option>Apply Later</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Rejected</option>
          <option>Offer</option>
        </select>
      </div>
    </div>
  );
}
