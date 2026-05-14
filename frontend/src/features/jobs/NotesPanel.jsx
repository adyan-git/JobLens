import { useEffect, useMemo, useState } from 'react';
import { normalizeJobRoleTitle } from '../../utils/roleNormalize';

function formatNoteDate(noteObj) {
  const raw = noteObj?.createdAt || noteObj?.date;
  if (!raw) return '';

  const d = raw instanceof Date ? raw : new Date(raw);
  if (Number.isNaN(d.getTime())) return '';

  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function NotesPanel({
  selectedJobData,
  onCloseThing,
  onAddNoteThing,
}) {
  const [noteTextValue, setNoteTextValue] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [localErrorThing, setLocalErrorThing] = useState('');

  const notesArray = useMemo(() => {
    const rawNotes = selectedJobData?.notes;
    return Array.isArray(rawNotes) ? rawNotes : [];
  }, [selectedJobData]);

  async function addNoteNow() {
    const textTrimmed = noteTextValue.trim();
    if (!textTrimmed) return;

    setLocalErrorThing('');
    setIsSavingNote(true);
    try {
      await onAddNoteThing?.(textTrimmed);
      setNoteTextValue('');
    } catch (err) {
      setLocalErrorThing(err?.message || 'Could not save note');
    } finally {
      setIsSavingNote(false);
    }
  }

  useEffect(() => {
    const previousOverflowValue = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflowValue;
    };
  }, []);

  if (!selectedJobData) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={onCloseThing}
        className="absolute inset-0 bg-black/70 transition-all duration-200"
        aria-label="Close notes panel"
      />

      <div className="absolute inset-x-0 bottom-0 sm:inset-y-0 sm:right-0 sm:left-auto w-full sm:w-[520px] bg-[#121212] border border-[#2a2a2a] sm:border-l sm:border-t-0 rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none shadow-2xl p-5 flex flex-col max-h-[85vh] sm:max-h-none transition-all duration-200">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-white">Notes</h2>
            <div className="text-sm text-gray-400 mt-1">
              {selectedJobData?.company ? selectedJobData.company : 'Job'}
              {selectedJobData?.role
                ? ` • ${
                    normalizeJobRoleTitle(selectedJobData.role) ||
                    selectedJobData.role.toString().trim()
                  }`
                : ''}
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseThing}
            className="text-gray-300 hover:text-white rounded-lg px-3 py-2 hover:bg-[#1f1f1f] transition-all duration-200 active:scale-[0.99]"
          >
            Close
          </button>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          {notesArray.length === 0 ? (
            <div className="py-16 flex items-center justify-center">
              <div className="text-center max-w-md text-gray-400 text-sm border border-[#2a2a2a] rounded-xl p-4 bg-[#151515]">
                No notes added yet
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {notesArray
                .slice()
                .sort((a, b) => {
                  const aTime = new Date(a?.createdAt || a?.date || 0).getTime();
                  const bTime = new Date(b?.createdAt || b?.date || 0).getTime();
                  return bTime - aTime;
                })
                .map((noteObj, idx) => (
                  <div
                    key={`${noteObj?.createdAt || noteObj?.date || 'note'}-${idx}`}
                    className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4 transition-all duration-200 hover:border-[#3a3a3a]"
                  >
                    <div className="text-xs text-gray-400 mb-2">
                      {formatNoteDate(noteObj)}
                    </div>
                    <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {noteObj?.text}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
          <label className="block text-sm text-gray-300 mb-2">Add a note</label>
          <textarea
            value={noteTextValue}
            onChange={(e) => setNoteTextValue(e.target.value)}
            placeholder="Write something quick..."
            className="w-full bg-[#0f0f0f] text-white rounded-xl px-3 py-2 border border-[#2a2a2a] focus:outline-none focus:border-[#E35E28] min-h-[110px] resize-y transition-all duration-200"
          />

          {localErrorThing ? (
            <div className="text-xs text-[#E35E28] mt-2">{localErrorThing}</div>
          ) : null}

          <div className="mt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCloseThing}
              className="px-4 py-2 rounded-lg border border-[#2a2a2a] text-gray-200 hover:bg-[#1f1f1f] transition-all duration-200 active:scale-[0.99]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addNoteNow}
              disabled={!noteTextValue.trim() || isSavingNote}
              className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 active:scale-[0.99] ${
                !noteTextValue.trim() || isSavingNote
                  ? 'bg-[#3a3a3a] cursor-not-allowed opacity-70'
                  : 'bg-[#E35E28] hover:bg-[#cf5222]'
              }`}
            >
              {isSavingNote ? 'Saving...' : 'Add Note'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

