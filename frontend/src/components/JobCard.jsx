export default function JobCard({
  jobDataThing,
  company,
  role,
  status,
  techStuffArray = [],
  url,
  onViewNotesThing,
}) {
  const urlString = url != null ? String(url).trim() : '';
  const hasUnsafeProtocol = /^\s*(javascript:|data:|vbscript:)/i.test(urlString);
  const hasJobUrlThing = urlString.length > 0 && !hasUnsafeProtocol;

  const getColorForStatusLabel = (status) => {
    switch (status) {
      case 'Applied': 
        return 'bg-blue-500/15 text-blue-300 border-blue-500/25';
      case 'Interview': 
        return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/25';
      case 'Rejected': 
        return 'bg-red-500/15 text-red-300 border-red-500/25';
      case 'Offer': 
        return 'bg-green-500/15 text-green-300 border-green-500/25';
      case 'Apply Later': 
      default: 
        return 'bg-gray-500/15 text-gray-300 border-gray-500/25';
    }
  };

  return (
    <div 
      className="bg-[#1a1a1a] rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-all duration-200 shadow-sm flex flex-col h-full hover:-translate-y-[2px] hover:shadow-md"
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
        {hasJobUrlThing ? (
          <a
            href={urlString}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.99] bg-white text-black hover:bg-gray-200 text-center"
          >
            View Job
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white/60 text-black/60 cursor-not-allowed opacity-60"
          >
            View Job
          </button>
        )}
        <button 
          type="button"
          onClick={() => onViewNotesThing?.(jobDataThing)}
          className="flex-1 bg-[#2f2f2f] hover:bg-[#3a3a3a] text-white py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-[#4a4a4a] active:scale-[0.99]"
        >
          View Notes
        </button>
      </div>

    </div>
  );
}
