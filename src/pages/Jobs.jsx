import React from 'react';
import Filters from '../components/Filters';
import JobList from '../features/jobs/JobList';

export default function Jobs() {
  return (
    <div className="p-6 space-y-6 h-full max-w-7xl mx-auto">
      
      <div>
        <h2 className="text-3xl font-bold text-white">Jobs</h2>
      </div>

      <Filters />

      
      <div className="pt-2">
        <JobList />
      </div>
      
    </div>
  );
}
