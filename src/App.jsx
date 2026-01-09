import { useState } from 'react';
import { LayoutDashboard, Calendar as CalendarIcon, CalendarDays, Target, PenTool, StickyNote, Timer } from 'lucide-react';
import { AppProvider } from './context/AppContext';
import ScheduleGrid from './components/ScheduleGrid';
import Dashboard from './components/Dashboard';
import ScoreLogger from './components/ScoreLogger';
import ScoreChart from './components/ScoreChart';
import FocusTimer from './components/FocusTimer';
import QuestionTracker from './components/QuestionTracker';
import StickyNotes from './components/StickyNotes';
import Calendar from './components/Calendar';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'schedule', label: 'Schedule', icon: CalendarIcon },
    { id: 'questions', label: 'Questions', icon: PenTool },
    { id: 'scores', label: 'Scores', icon: Target },
    { id: 'notes', label: 'Notes', icon: StickyNote },
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
            {activeTab === 'calendar' && <Calendar />}
            {activeTab === 'schedule' && <ScheduleGrid />}
            {activeTab === 'questions' && <QuestionTracker />}
            {activeTab === 'scores' && (
              <div className="scores-container">
                <ScoreLogger />
                <ScoreChart />
              </div>
            )}
            {activeTab === 'notes' && <StickyNotes />}
            {activeTab === 'timer' && <FocusTimer />}
          </div>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
