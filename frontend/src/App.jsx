import { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Insights from './pages/Insights';
import Login from './pages/Login';
import Register from './pages/Register';
import JobForm from './features/jobs/JobForm';
import { useAuth } from './context/AuthContext';

function App() {
  const { token } = useAuth();
  const [authScreen, setAuthScreen] = useState('login');
  const [currentSelectedView, setView] = useState('dashboard');
  const [showJobFormPanelThing, setShowJobFormPanelThing] = useState(false);

  if (!token) {
    return authScreen === 'login' ? (
      <Login onGoRegister={() => setAuthScreen('register')} />
    ) : (
      <Register onGoLogin={() => setAuthScreen('login')} />
    );
  }

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
        {currentSelectedView === 'dashboard' && (
          <Dashboard onViewAllInsightsThing={() => setView('insights')} />
        )}

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
