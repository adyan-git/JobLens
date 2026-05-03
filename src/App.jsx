import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Insights from './pages/Insights';

function App() {
  const [currentSelectedView, setView] = useState('dashboard');

  return (
    <div 
      className="min-h-screen bg-[#0f0f0f] text-white flex flex-col"
    >
      <Navbar 
        view={currentSelectedView} 
        setView={setView} 
      />
      
      <main className="flex-1">
        {currentSelectedView === 'dashboard' && <Dashboard />}

        {currentSelectedView === 'jobs' && <Jobs />}

        {currentSelectedView === 'insights' && <Insights />}
      </main>

    </div>
  );
}

export default App;
