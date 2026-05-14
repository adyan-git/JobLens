import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

function getUserInitials(name, email) {
  const n = (name || '').trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const a = parts[0][0];
      const b = parts[1][0];
      if (a && b) return (a + b).toUpperCase();
    }
    const first = n[0];
    return first ? first.toUpperCase() : '';
  }
  const e = (email || '').trim();
  return e ? e[0].toUpperCase() : '?';
}

function getDisplayLabel(name, email) {
  const n = (name || '').trim();
  if (n) return n;
  const e = (email || '').trim();
  if (!e) return 'Account';
  const at = e.indexOf('@');
  return at > 0 ? e.slice(0, at) : e;
}

export default function Navbar({ view, setView, onLogJobClick }) {
  const { currentUser, logout } = useAuth();

  const userInitials = useMemo(
    () => getUserInitials(currentUser?.name, currentUser?.email),
    [currentUser?.name, currentUser?.email]
  );
  const userLabel = useMemo(
    () => getDisplayLabel(currentUser?.name, currentUser?.email),
    [currentUser?.name, currentUser?.email]
  );
  const navigationMenuList = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'insights', label: 'Insights' },
  ];

  const navBtnBase =
    'rounded-lg transition-all duration-200 flex items-center justify-center active:scale-[0.99] touch-manipulation min-h-[2.5rem] px-2.5 py-2 text-sm sm:min-h-0 sm:px-4 sm:py-2 sm:text-base';

  return (
    <nav className="flex w-full min-w-0 max-w-full flex-col gap-3 border-b border-gray-800 bg-[#1a1a1a] px-3 py-3 text-white sm:flex-row sm:flex-nowrap sm:items-center sm:justify-between sm:gap-3 sm:px-6 sm:py-4 md:gap-4">
      <div className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3">
        <img
          src="/favicon-joblens.png"
          alt=""
          width={40}
          height={40}
          decoding="async"
          className="h-8 w-8 shrink-0 object-contain select-none sm:h-9 sm:w-9 md:h-10 md:w-10"
        />
        <h1 className="text-xl font-bold leading-none tracking-wide sm:text-2xl">JobLens</h1>
      </div>

      <div className="grid min-w-0 w-full grid-cols-3 gap-1.5 sm:flex sm:w-auto sm:justify-center sm:gap-2 lg:gap-3">
        {navigationMenuList.map((navItem) => (
          <button
            key={navItem.id}
            type="button"
            onClick={() => setView(navItem.id)}
            className={`${navBtnBase} ${
              view === navItem.id
                ? 'bg-[#E35E28] font-medium text-white shadow-md'
                : 'text-gray-300 hover:bg-[#333333] hover:text-white'
            }`}
          >
            {navItem.label}
          </button>
        ))}
      </div>

      <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-end sm:gap-2 md:gap-3">
        <div
          className={`flex min-w-0 w-full items-center gap-2 sm:w-auto sm:justify-end ${
            currentUser ? 'justify-between' : 'justify-end'
          }`}
        >
          {currentUser ? (
            <div
              className="inline-flex min-w-0 max-w-[min(100%,14rem)] items-center gap-2 rounded-full border border-gray-700/90 bg-[#222222] py-1 pl-1 pr-2 transition-all duration-200 hover:border-gray-600 hover:bg-[#2a2a2a] sm:pr-3"
              title={userLabel}
              aria-label={`Signed in as ${userLabel}`}
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#333333] text-[11px] font-semibold uppercase tracking-wide text-gray-200 ring-1 ring-gray-600/40"
                aria-hidden
              >
                {userInitials}
              </span>
              <span className="hidden min-w-0 flex-1 truncate text-sm text-gray-300 sm:inline">
                {userLabel}
              </span>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => logout()}
            className="shrink-0 whitespace-nowrap rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-300 transition-all duration-200 hover:bg-[#333333] hover:text-white active:scale-[0.99] sm:px-4 sm:text-base"
          >
            Log out
          </button>
        </div>
        <button
          type="button"
          onClick={onLogJobClick}
          className="w-full min-w-0 shrink-0 rounded-lg bg-white px-3 py-2 text-sm font-medium text-black transition-all duration-200 hover:bg-gray-200 active:scale-[0.99] sm:w-auto sm:px-4 sm:text-base"
        >
          + Log a Job
        </button>
      </div>
    </nav>
  );
}
