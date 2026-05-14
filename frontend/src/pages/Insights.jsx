import { useEffect, useMemo, useState } from 'react';
import InsightsPanel from '../features/insights/InsightsPanel';
import { fetchAllJobsFromBackend } from '../services/jobService';
import { generateJobInsightsThing } from '../utils/insightGenerator';

export default function Insights() {
  const [jobListDataThing, setJobListDataThing] = useState([]);
  const [isLoadingJobsThing, setIsLoadingJobsThing] = useState(true);

  useEffect(() => {
    async function refreshJobs() {
      try {
        setIsLoadingJobsThing(true);
        const jobs = await fetchAllJobsFromBackend();
        setJobListDataThing(Array.isArray(jobs) ? jobs : []);
      } catch (err) {
        console.error('Error fetching jobs for insights:', err);
        setJobListDataThing([]);
      } finally {
        setIsLoadingJobsThing(false);
      }
    }

    refreshJobs();

    const onJobSaved = () => refreshJobs();
    window.addEventListener('jobSaved', onJobSaved);

    return () => {
      window.removeEventListener('jobSaved', onJobSaved);
    };
  }, []);

  const { insightsArray, metricsThing } = useMemo(() => {
    return generateJobInsightsThing(jobListDataThing);
  }, [jobListDataThing]);

  return (
    <div className="p-6 space-y-6 h-full max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-white">Insights</h2>
        <p className="text-sm text-gray-400 mt-2">
          Simple patterns based on your job tracking.
        </p>
      </div>

      <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-3">
            <div className="text-xs text-gray-400">Total Jobs</div>
            <div className="text-xl font-semibold text-white mt-1">
              {metricsThing?.totalJobs ?? 0}
            </div>
          </div>
          <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-3">
            <div className="text-xs text-gray-400">Interviews</div>
            <div className="text-xl font-semibold text-white mt-1">
              {metricsThing?.totalInterviews ?? 0}
            </div>
          </div>
          <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-3">
            <div className="text-xs text-gray-400">Rejections</div>
            <div className="text-xl font-semibold text-white mt-1">
              {metricsThing?.totalRejections ?? 0}
            </div>
          </div>
        </div>
      </div>

      <div>
        {isLoadingJobsThing ? (
          <div className="text-gray-300">Loading insights...</div>
        ) : (
          <InsightsPanel insightsDataThing={insightsArray} />
        )}
      </div>
    </div>
  );
}
