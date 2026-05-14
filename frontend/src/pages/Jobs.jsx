import { useEffect, useMemo, useState } from 'react';
import Filters from '../components/Filters';
import JobList from '../features/jobs/JobList';
import NotesPanel from '../features/jobs/NotesPanel';
import { addNewNoteToJob, fetchAllJobsFromBackend } from '../services/jobService';
import { normalizeJobRoleTitle, roleKeyForMatching } from '../utils/roleNormalize';

function buildRoleOptionsFromJobs(jobs) {
  const map = new Map();
  const list = Array.isArray(jobs) ? jobs : [];
  for (const job of list) {
    const label = normalizeJobRoleTitle((job?.role ?? '').toString());
    if (!label) continue;
    const key = label.toLowerCase();
    if (!map.has(key)) map.set(key, label);
  }
  return Array.from(map.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
}

export default function Jobs() {
  const [jobListDataThing, setJobListDataThing] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [selectedJobForNotesThing, setSelectedJobForNotesThing] = useState(null);
  const [showNotesPanelThing, setShowNotesPanelThing] = useState(false);
  const [selectedStatusThing, setSelectedStatusThing] = useState('all');
  const [selectedRoleThing, setSelectedRoleThing] = useState('all');

  useEffect(() => {
    async function refreshJobs() {
      try {
        setIsLoadingJobs(true);
        const jobs = await fetchAllJobsFromBackend();
        setJobListDataThing(Array.isArray(jobs) ? jobs : []);
      } catch (err) {
        console.error('Error fetching jobs:', err);
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

  const roleOptionsThing = useMemo(
    () => buildRoleOptionsFromJobs(jobListDataThing),
    [jobListDataThing]
  );

  const validRoleKeysThing = useMemo(
    () => new Set(roleOptionsThing.map((o) => o.value)),
    [roleOptionsThing]
  );

  const effectiveRoleFilterThing =
    selectedRoleThing === 'all' || validRoleKeysThing.has(selectedRoleThing)
      ? selectedRoleThing
      : 'all';

  function openNotesPanel(jobObj) {
    if (!jobObj?._id) return;
    setSelectedJobForNotesThing(jobObj);
    setShowNotesPanelThing(true);
  }

  function closeNotesPanel() {
    setShowNotesPanelThing(false);
    setSelectedJobForNotesThing(null);
  }

  async function addNoteAndRefreshSelected(noteText) {
    const jobId = selectedJobForNotesThing?._id;
    if (!jobId) return;

    const updatedJob = await addNewNoteToJob(jobId, noteText);

    setSelectedJobForNotesThing(updatedJob);
    setJobListDataThing((prev) => {
      if (!Array.isArray(prev)) return prev;
      return prev.map((j) => (j?._id === updatedJob?._id ? updatedJob : j));
    });

    // keep the same refresh pattern used elsewhere (dashboard/insights listen to this)
    window.dispatchEvent(new Event('jobSaved'));
  }

  const filteredJobsThing = (Array.isArray(jobListDataThing) ? jobListDataThing : []).filter(
    (jobThing) => {
      const jobStatusThing = (jobThing?.status || '').toString();
      const jobRoleNormThing = roleKeyForMatching(jobThing?.role);

      const statusMatchesThing =
        selectedStatusThing === 'all' || jobStatusThing === selectedStatusThing;

      const roleMatchesThing =
        effectiveRoleFilterThing === 'all' || jobRoleNormThing === effectiveRoleFilterThing;

      return statusMatchesThing && roleMatchesThing;
    }
  );

  return (
    <div className="p-6 space-y-6 h-full max-w-7xl mx-auto">
      
      <div>
        <h2 className="text-3xl font-bold text-white">Jobs</h2>
      </div>

      <Filters
        roleOptionsThing={roleOptionsThing}
        selectedStatusThing={selectedStatusThing}
        selectedRoleThing={effectiveRoleFilterThing}
        onStatusChangeThing={setSelectedStatusThing}
        onRoleChangeThing={setSelectedRoleThing}
      />

      
      <div className="pt-2">
        {isLoadingJobs ? (
          <div className="text-gray-300">Loading jobs...</div>
        ) : (
          <JobList jobs={filteredJobsThing} onViewNotesThing={openNotesPanel} />
        )}
      </div>
      
      {showNotesPanelThing ? (
        <NotesPanel
          selectedJobData={selectedJobForNotesThing}
          onCloseThing={closeNotesPanel}
          onAddNoteThing={addNoteAndRefreshSelected}
        />
      ) : null}
    </div>
  );
}
