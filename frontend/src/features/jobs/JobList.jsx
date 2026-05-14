import JobCard from '../../components/JobCard';
import { normalizeJobRoleTitle } from '../../utils/roleNormalize';

export default function JobList({ jobs = [], onViewNotesThing }) {
  const jobsArray = Array.isArray(jobs) ? jobs : [];

  if (jobsArray.length === 0) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-gray-300 font-medium">No jobs added yet</div>
          <div className="text-sm text-gray-500 mt-2">
            Click “Log a Job” to start tracking applications.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {jobsArray.map((jobItem, index) => (
        <JobCard 
          key={jobItem?._id || index}
          jobDataThing={jobItem}
          company={jobItem?.company}
          role={
            normalizeJobRoleTitle(jobItem?.role ?? '') ||
            (jobItem?.role ?? '').toString().trim()
          }
          status={jobItem?.status}
          techStuffArray={Array.isArray(jobItem?.techStack) ? jobItem.techStack : []}
          url={jobItem?.url}
          onViewNotesThing={onViewNotesThing}
        />
      ))}
    </div>
  );
}
