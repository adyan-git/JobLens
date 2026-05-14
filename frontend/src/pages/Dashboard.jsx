import { useEffect, useMemo, useState } from 'react';
import StatsCard from '../components/StatsCard';
import { fetchAllJobsFromBackend } from '../services/jobService';
import { generateJobInsightsThing } from '../utils/insightGenerator';
import { normalizeJobRoleTitle } from '../utils/roleNormalize';

export default function Dashboard({ onViewAllInsightsThing }) {
  const [jobListDataThing, setJobListDataThing] = useState([]);
  const [isLoadingDashboardThing, setIsLoadingDashboardThing] = useState(true);

  useEffect(() => {
    async function refreshDashboard() {
      try {
        setIsLoadingDashboardThing(true);
        const jobs = await fetchAllJobsFromBackend();
        setJobListDataThing(Array.isArray(jobs) ? jobs : []);
      } catch (err) {
        console.error('Error fetching jobs for dashboard:', err);
        setJobListDataThing([]);
      } finally {
        setIsLoadingDashboardThing(false);
      }
    }

    refreshDashboard();

    const onJobSaved = () => refreshDashboard();
    window.addEventListener('jobSaved', onJobSaved);

    return () => {
      window.removeEventListener('jobSaved', onJobSaved);
    };
  }, []);

  const { dashboardStatsArray, recentJobThingData, dashboardInsightsThing } = useMemo(() => {
    const jobs = Array.isArray(jobListDataThing) ? jobListDataThing : [];

    const statusCounts = jobs.reduce(
      (acc, job) => {
        const status = (job?.status || '').toString();
        if (status === 'Applied') acc.applied += 1;
        else if (status === 'Interview') acc.interview += 1;
        else if (status === 'Rejected') acc.rejected += 1;
        else if (status === 'Offer') acc.offer += 1;
        else acc.applyLater += 1; // default + "Apply Later"
        return acc;
      },
      { applied: 0, interview: 0, rejected: 0, offer: 0, applyLater: 0 }
    );

    const statsArray = [
      { title: 'Total', value: jobs.length },
      { title: 'Applied', value: statusCounts.applied },
      { title: 'Interview', value: statusCounts.interview },
      { title: 'Rejected', value: statusCounts.rejected },
      { title: 'Offer', value: statusCounts.offer },
    ];

    const recentJobs = jobs
      .slice()
      .sort((a, b) => {
        const aTime = new Date(a?.createdAt || a?.updatedAt || 0).getTime();
        const bTime = new Date(b?.createdAt || b?.updatedAt || 0).getTime();
        return bTime - aTime;
      })
      .slice(0, 5)
      .map((j) => ({
      id: j?._id,
      company: j?.company,
      role:
        normalizeJobRoleTitle(j?.role ?? '') || (j?.role ?? '').toString().trim(),
      status: j?.status,
    }));

    const { insightsArray } = generateJobInsightsThing(jobs);
    const insightsForDashboard = (Array.isArray(insightsArray) ? insightsArray : [])
      .slice(0, 3)
      .map((x, idx) => ({
        id: `${x?.title || 'insight'}-${idx}`,
        text: x?.message || x?.title,
      }));

    return {
      dashboardStatsArray: statsArray,
      recentJobThingData: recentJobs,
      dashboardInsightsThing: insightsForDashboard,
    };
  }, [jobListDataThing]);

  const renderStatusBadge = (status) => {
    let colorCodeStr = 'bg-gray-500/15 text-gray-300 border border-gray-500/25';
    
    if (status === 'Applied') colorCodeStr = 'bg-blue-500/15 text-blue-300 border border-blue-500/25';
    if (status === 'Interview') colorCodeStr = 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/25';
    if (status === 'Rejected') colorCodeStr = 'bg-red-500/15 text-red-300 border border-red-500/25';
    if (status === 'Offer') colorCodeStr = 'bg-green-500/15 text-green-300 border border-green-500/25';

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
        
        {isLoadingDashboardThing ? (
          <div className="text-gray-300">Loading dashboard...</div>
        ) : recentJobThingData.length === 0 ? (
          <div className="py-12 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="text-gray-300 font-medium">No job activity yet</div>
              <div className="text-sm text-gray-500 mt-2">
                Log a job to see your recent applications here.
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {recentJobThingData.map((job) => (
              <div
                key={job.id}
                className="bg-[#1a1a1a] rounded-xl p-4 flex items-center justify-between border border-gray-800 hover:border-gray-700 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-sm"
              >
                <div className="min-w-0 pr-4">
                  <h3 className="text-lg font-semibold text-white truncate">{job.role}</h3>
                  <p className="text-sm text-gray-400 truncate">{job.company}</p>
                </div>
                
                <div className="shrink-0">{renderStatusBadge(job.status)}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold text-white">Insights</h2>
          <button
            type="button"
            onClick={() => onViewAllInsightsThing?.()}
            className="text-sm text-gray-300 hover:text-white transition-all duration-200 underline underline-offset-4 decoration-gray-600 hover:decoration-gray-300"
          >
            View all insights
          </button>
        </div>
        
        {isLoadingDashboardThing ? (
          <div className="text-gray-300">Generating insights...</div>
        ) : dashboardInsightsThing.length === 0 ? (
          <div className="py-12 flex items-center justify-center">
            <div className="text-center max-w-md text-gray-400 text-sm border border-[#2a2a2a] rounded-xl p-4 bg-[#151515]">
              Not enough data yet to generate insights.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {dashboardInsightsThing.map((insight) => (
              <div
                key={insight.id}
                className="bg-[#1a1a1a] rounded-xl p-4 flex items-center space-x-3 border border-gray-800 transition-all duration-200 hover:border-gray-700"
              >
                <div className="text-[#E35E28] shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-300 font-medium">{insight.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
