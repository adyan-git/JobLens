import React from 'react';
import JobCard from '../../components/JobCard';

export default function JobList() {
  const fakeJobsListForNow = [
    {
      company: "Infosys",
      role: "Frontend Developer",
      status: "Applied",
      techStack: ["React", "JavaScript"]
    },
    {
      company: "TCS",
      role: "Backend Developer",
      status: "Interview",
      techStack: ["Node", "MongoDB"]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {fakeJobsListForNow.map((jobItem, index) => (
        <JobCard 
          key={index}
          company={jobItem.company}
          role={jobItem.role}
          status={jobItem.status}
          techStuffArray={jobItem.techStack}
        />
      ))}
    </div>
  );
}
