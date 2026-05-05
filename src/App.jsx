import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Insights from './pages/Insights';
import JobForm from './features/jobs/JobForm';

function App() {
  const [currentSelectedView, setView] = useState('dashboard');
  const [showJobFormPanelThing, setShowJobFormPanelThing] = useState(false);

  return (
    <div 
      className="min-h-screen bg-[#0f0f0f] text-white flex flex-col"
    >
      <Navbar 
        view={currentSelectedView} 
        setView={setView} 
        onLogJobClick={() => setShowJobFormPanelThing(true)}
      />
      
      <main className="flex-1">
        {currentSelectedView === 'dashboard' && <Dashboard />}

        {currentSelectedView === 'jobs' && <Jobs />}

        {currentSelectedView === 'insights' && <Insights />}
      </main>

      <JobForm
        open={showJobFormPanelThing}
        onClose={() => setShowJobFormPanelThing(false)}
      />
    </div>
  );
}

export default App;
