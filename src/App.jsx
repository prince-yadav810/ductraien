import { useState } from 'react';
import { LayoutDashboard, Calendar as CalendarIcon, Target, Timer, Zap } from 'lucide-react';
import { AppProvider } from './context/AppContext';
import ScheduleGrid from './components/ScheduleGrid';
import Dashboard from './components/Dashboard';
import ScoreLogger from './components/ScoreLogger';
import ScoreChart from './components/ScoreChart';
import FocusTimer from './components/FocusTimer';
import PhysicsPlan from './components/PhysicsPlan';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule', label: 'Schedule', icon: CalendarIcon },
    { id: 'physplan', label: 'Phy Plan', icon: Zap },
    { id: 'scores', label: 'Scores', icon: Target },
    { id: 'timer', label: 'Focus', icon: Timer },
  ];

  return (
    <AppProvider>
      <div className="app">
        <header className="app-header">
          <nav className="header-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </header>

        <main className="main-content">
          <div className="tab-content fade-in" key={activeTab}>
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'schedule' && <ScheduleGrid />}
            {activeTab === 'scores' && (
              <div className="scores-container">
                <ScoreLogger />
                <ScoreChart />
              </div>
            )}
            {activeTab === 'timer' && <FocusTimer />}
            {activeTab === 'physplan' && <PhysicsPlan />}
          </div>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
