import { useEffect, useState } from 'react';
import Filters from '../components/Filters';
import JobList from '../features/jobs/JobList';
import { fetchAllJobsFromBackend } from '../services/jobService';

export default function Jobs() {
  const [jobListDataThing, setJobListDataThing] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  useEffect(() => {
    async function refreshJobs() {
      try {
        setIsLoadingJobs(true);
        const jobs = await fetchAllJobsFromBackend();
        setJobListDataThing(Array.isArray(jobs) ? jobs : []);
      } catch (err) {
        console.log('Error fetching jobs:', err);
        setJobListDataThing([]);
      } finally {
        setIsLoadingJobs(false);
      }
    }

    refreshJobs();

    const onJobSaved = () => refreshJobs();
    window.addEventListener('jobSaved', onJobSaved);

    return () => {
      window.removeEventListener('jobSaved', onJobSaved);
    };
  }, []);

  return (
    <div className="p-6 space-y-6 h-full max-w-7xl mx-auto">
      
      <div>
        <h2 className="text-3xl font-bold text-white">Jobs</h2>
      </div>

      <Filters />

      
      <div className="pt-2">
        {isLoadingJobs ? (
          <div className="text-gray-300">Loading jobs...</div>
        ) : (
          <JobList jobs={jobListDataThing} />
        )}
      </div>
      
    </div>
  );
}
