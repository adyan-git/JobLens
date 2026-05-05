import JobCard from '../../components/JobCard';

export default function JobList({ jobs = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {jobs.map((jobItem, index) => (
        <JobCard 
          key={jobItem?._id || index}
          company={jobItem?.company}
          role={jobItem?.role}
          status={jobItem?.status}
          techStuffArray={Array.isArray(jobItem?.techStack) ? jobItem.techStack : []}
          url={jobItem?.url}
        />
      ))}
    </div>
  );
}
