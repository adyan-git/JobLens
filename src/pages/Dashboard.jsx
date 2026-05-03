import React from 'react';
import StatsCard from '../components/StatsCard';

export default function Dashboard() {
  const dashboardStatsArray = [
    { title: 'Total', value: 12 },
    { title: 'Applied', value: 6 },
    { title: 'Interview', value: 2 },
    { title: 'Rejected', value: 3 },
    { title: 'Offer', value: 1 },
  ];

  const recentJobThingData = [
    { id: 1, company: 'Google', role: 'Frontend Engineer', status: 'Applied' },
    { id: 2, company: 'Meta', role: 'React Developer', status: 'Interview' },
    { id: 3, company: 'Netflix', role: 'UI Engineer', status: 'Rejected' },
  ];

  const weirdStatusCheckVar = [
    { id: 1, text: 'Low interview rate in Frontend roles' },
    { id: 2, text: 'High rejections in React jobs' },
  ];

  const renderStatusBadge = (status) => {
    let colorCodeStr = 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    
    if (status === 'Applied') colorCodeStr = 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    if (status === 'Interview') colorCodeStr = 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    if (status === 'Rejected') colorCodeStr = 'bg-red-500/20 text-red-400 border border-red-500/30';
    if (status === 'Offer') colorCodeStr = 'bg-green-500/20 text-green-400 border border-green-500/30';

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorCodeStr}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6 h-full max-w-7xl mx-auto">
      
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {dashboardStatsArray.map((stat, index) => (
            <StatsCard 
              key={index} 
              title={stat.title} 
              value={stat.value} 
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">Recent Applications</h2>
        
        <div className="space-y-3">
          {recentJobThingData.map((job) => (
            <div
              key={job.id}
              className="bg-[#1a1a1a] rounded-xl p-4 flex items-center justify-between border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div>
                <h3 className="text-lg font-semibold text-white">{job.role}</h3>
                <p className="text-sm text-gray-400">{job.company}</p>
              </div>
              
              <div>{renderStatusBadge(job.status)}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">Insights</h2>
        
        <div className="space-y-3">
          {weirdStatusCheckVar.map((insight) => (
            <div
              key={insight.id}
              className="bg-[#1a1a1a] rounded-xl p-4 flex items-center space-x-3 border border-gray-800"
            >
              <div className="text-[#E35E28]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
              </div>
              <p className="text-sm text-gray-300 font-medium">{insight.text}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
