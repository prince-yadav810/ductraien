import { Zap, Microscope, Leaf, FlaskConical, Target, Check } from 'lucide-react';
import { ACTIVITY_TYPES } from '../data/scheduleData';
import { useApp } from '../context/AppContext';
import './DayCard.css';

const SUBJECT_STYLES = {
    'PHY_B1': { bg: '#e8f0ff', color: '#007aff', icon: Zap, label: 'Physics' },
    'PHY_B2': { bg: '#e8f0ff', color: '#007aff', icon: Zap, label: 'Physics' },
    'PHY_B3': { bg: '#e8f0ff', color: '#007aff', icon: Zap, label: 'Physics' },
    'PHY_B4': { bg: '#e8f0ff', color: '#007aff', icon: Zap, label: 'Physics' },
    'PHY_PYQ': { bg: '#e8f0ff', color: '#007aff', icon: Zap, label: 'Physics' },
    'PHY_FINAL': { bg: '#e8f0ff', color: '#007aff', icon: Zap, label: 'Physics' },
    'ZOOLOGY': { bg: '#f3ecff', color: '#8b5cf6', icon: Microscope, label: 'Zoology' },
    'BOTANY': { bg: '#e8faf0', color: '#16a34a', icon: Leaf, label: 'Botany' },
    'CHEM': { bg: '#fff4e6', color: '#ea580c', icon: FlaskConical, label: 'Chemistry' },
};

const DayCard = ({ day, isToday, isFixedDone, isAltDone, isMockDone, isPast }) => {
    const { toggleTask } = useApp();
    
    const fixedStyle = SUBJECT_STYLES[day.fixedSubject] || SUBJECT_STYLES['PHY_B1'];
    const altStyle = SUBJECT_STYLES[day.altSubject] || SUBJECT_STYLES['CHEM'];
    const mockStyle = { bg: '#fff0f0', color: '#dc2626', icon: Target, label: 'Mock Test' };

    const fixedActivity = ACTIVITY_TYPES[day.fixedSubject];
    const altActivity = ACTIVITY_TYPES[day.altSubject];

    const FixedIcon = fixedStyle.icon;
    const AltIcon = altStyle.icon;
    const MockIcon = mockStyle.icon;

    const isCompleted = isFixedDone && isAltDone && isMockDone;

    const handleChipClick = (e, taskType) => {
        e.stopPropagation();
        toggleTask(day.date, taskType, taskType === 'fixed' ? day.fixedSubject : null);
    };

    return (
        <div
            className={`day-card ${isToday ? 'today' : ''} ${isCompleted ? 'completed' : ''} ${isPast && !isCompleted ? 'missed' : ''}`}
            style={{ '--theme-color': fixedStyle.color }}
        >
            {isCompleted && (
                <div className="completed-check-corner">
                    <Check size={16} strokeWidth={3} />
                </div>
            )}
            
            <div className="day-card-header">
                <div className="day-date-group">
                    <span className="day-name">{day.day}</span>
                    <span className="day-date">{day.date.split('-')[2]}</span>
                </div>
                {isToday && <span className="today-badge">TODAY</span>}
            </div>

            <div className="day-card-chips">
                <button 
                    className={`task-chip ${isFixedDone ? 'done' : ''}`} 
                    style={!isFixedDone ? { backgroundColor: fixedStyle.bg, color: fixedStyle.color } : {}}
                    onClick={(e) => handleChipClick(e, 'fixed')}
                >
                    {isFixedDone ? <Check size={16} /> : <FixedIcon size={16} />}
                    <span className="chip-label">{fixedActivity?.short || day.fixedSubject}</span>
                </button>
                <button 
                    className={`task-chip ${isAltDone ? 'done' : ''}`} 
                    style={!isAltDone ? { backgroundColor: altStyle.bg, color: altStyle.color } : {}}
                    onClick={(e) => handleChipClick(e, 'alt')}
                >
                    {isAltDone ? <Check size={16} /> : <AltIcon size={16} />}
                    <span className="chip-label">{altActivity?.short || day.altSubject}</span>
                </button>
                <button 
                    className={`task-chip ${isMockDone ? 'done' : ''}`} 
                    style={!isMockDone ? { backgroundColor: mockStyle.bg, color: mockStyle.color } : {}}
                    onClick={(e) => handleChipClick(e, 'mock')}
                >
                    {isMockDone ? <Check size={16} /> : <MockIcon size={16} />}
                    <span className="chip-label">{mockStyle.label}</span>
                </button>
            </div>
        </div>
    );
};

export default DayCard;
