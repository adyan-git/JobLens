import { useEffect, useMemo, useState } from 'react';
import { sendNewJobToBackend } from '../../services/jobService';
import { normalizeJobRoleTitle } from '../../utils/roleNormalize';

export default function JobForm({ open, onClose }) {
  const [companyNameValue, setCompanyNameValue] = useState('');
  const [roleValue, setRoleValue] = useState('');
  const [statusValue, setStatusValue] = useState('Apply Later');
  const [techStackValue, setTechStackValue] = useState('');
  const [urlValue, setUrlValue] = useState('');
  const [interviewDateValue, setInterviewDateValue] = useState('');
  const [notesValue, setNotesValue] = useState('');
  const [triedToSaveOnce, setTriedToSaveOnce] = useState(false);
  const [isSavingJobThing, setIsSavingJobThing] = useState(false);

  const statusOptions = useMemo(
    () => ['Apply Later', 'Applied', 'Interview', 'Rejected', 'Offer'],
    []
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflowValue = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflowValue;
    };
  }, [open]);

  if (!open) return null;

  const inputBase =
    'w-full bg-[#121212] text-white rounded-lg px-3 py-2 border border-[#2a2a2a] focus:outline-none focus:border-[#E35E28]';

  const companyNameTrimmed = companyNameValue.trim();
  const roleNormalized = normalizeJobRoleTitle(roleValue);
  const canSaveThisThing = Boolean(companyNameTrimmed && roleNormalized);

  function resetFormValues() {
    setCompanyNameValue('');
    setRoleValue('');
    setStatusValue('Apply Later');
    setTechStackValue('');
    setUrlValue('');
    setInterviewDateValue('');
    setNotesValue('');
    setTriedToSaveOnce(false);
  }

  function closeAndReset() {
    resetFormValues();
    onClose?.();
  }

  async function submitJobLog(e) {
    e.preventDefault();
    setTriedToSaveOnce(true);

    if (!canSaveThisThing || isSavingJobThing) return;

    const jobObject = {
      company: companyNameTrimmed,
      role: roleNormalized,
      status: statusValue,
      techStack: techStackValue.trim(),
      url: urlValue.trim() || null,
      interviewDate: statusValue === 'Interview' ? interviewDateValue || null : null,
      notes: notesValue.trim(),
    };

    try {
      setIsSavingJobThing(true);
      await sendNewJobToBackend(jobObject);
      window.dispatchEvent(new Event('jobSaved'));
      closeAndReset();
    } catch (err) {
      console.error('Error saving job:', err);
    } finally {
      setIsSavingJobThing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={closeAndReset}
        className="absolute inset-0 bg-black/60 transition-all duration-200"
        aria-label="Close log job form"
      />

      <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-[#1a1a1a] border-l border-[#2a2a2a] rounded-l-2xl shadow-2xl p-5 overflow-y-auto">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Log a Job</h2>
            <p className="text-sm text-gray-400 mt-1">
              Keep it quick — manage status and notes from Jobs after you save.
            </p>
          </div>

          <button
            type="button"
            onClick={closeAndReset}
            className="text-gray-400 hover:text-white rounded-lg px-3 py-2 hover:bg-[#242424] transition-all duration-200 active:scale-[0.99]"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={submitJobLog} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Company Name</label>
            <input
              value={companyNameValue}
              onChange={(e) => setCompanyNameValue(e.target.value)}
              className={inputBase}
              placeholder="eg. Acme Inc"
              autoFocus
            />
            {triedToSaveOnce && !companyNameTrimmed ? (
              <div className="text-xs text-[#E35E28] mt-2">Company name is required</div>
            ) : null}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Role</label>
            <input
              value={roleValue}
              onChange={(e) => setRoleValue(e.target.value)}
              className={inputBase}
              placeholder="eg. Frontend Developer"
            />
            {triedToSaveOnce && !roleNormalized ? (
              <div className="text-xs text-[#E35E28] mt-2">Role is required</div>
            ) : null}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Status</label>
            <select
              value={statusValue}
              onChange={(e) => {
                const nextStatus = e.target.value;
                setStatusValue(nextStatus);
                if (nextStatus !== 'Interview') {
                  setInterviewDateValue('');
                }
              }}
              className={inputBase}
            >
              {statusOptions.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Tech Stack</label>
            <input
              value={techStackValue}
              onChange={(e) => setTechStackValue(e.target.value)}
              className={inputBase}
              placeholder="React, Node, Postgres..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Job URL (optional)</label>
            <input
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              className={inputBase}
              placeholder="https://..."
            />
          </div>

          {statusValue === 'Interview' && (
            <div>
              <label className="block text-sm text-gray-300 mb-2">Interview Date</label>
              <input
                type="date"
                value={interviewDateValue}
                onChange={(e) => setInterviewDateValue(e.target.value)}
                className={inputBase}
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-300 mb-2">Notes</label>
            <textarea
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              className={`${inputBase} min-h-[120px] resize-y`}
              placeholder="Anything you want to remember..."
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeAndReset}
              className="px-4 py-2 rounded-lg border border-[#2a2a2a] text-gray-200 hover:bg-[#242424] transition-all duration-200 active:scale-[0.99]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!canSaveThisThing || isSavingJobThing}
              className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 active:scale-[0.99] ${
                canSaveThisThing && !isSavingJobThing
                  ? 'bg-[#E35E28] hover:bg-[#cf5222] hover:shadow-sm'
                  : 'bg-[#3a3a3a] cursor-not-allowed opacity-70'
              }`}
            >
              {isSavingJobThing ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

