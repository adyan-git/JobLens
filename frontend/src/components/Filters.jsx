export default function Filters({
  roleOptionsThing = [],
  selectedRoleThing = 'all',
  selectedStatusThing = 'all',
  onRoleChangeThing,
  onStatusChangeThing,
}) {
  return (
    <div className="flex flex-wrap gap-6 bg-[#1a1a1a] p-5 rounded-xl border border-gray-800">
      
      <div className="flex flex-col space-y-1">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Filter by Role
        </label>
        <select 
          value={selectedRoleThing}
          onChange={(e) => onRoleChangeThing?.(e.target.value)}
          className="bg-[#2a2a2a] text-white border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#E35E28] min-w-[180px] sm:min-w-[200px] transition-all duration-200 hover:border-gray-600"
        >
          <option value="all">All Roles</option>
          {(Array.isArray(roleOptionsThing) ? roleOptionsThing : []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex flex-col space-y-1">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Filter by Status
        </label>
        <select 
          value={selectedStatusThing}
          onChange={(e) => onStatusChangeThing?.(e.target.value)}
          className="bg-[#2a2a2a] text-white border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#E35E28] min-w-[180px] sm:min-w-[200px] transition-all duration-200 hover:border-gray-600"
        >
          <option value="all">All Statuses</option>
            <option value="Apply Later">Apply Later</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Rejected">Rejected</option>
          <option value="Offer">Offer</option>
        </select>
      </div>
    </div>
  );
}
