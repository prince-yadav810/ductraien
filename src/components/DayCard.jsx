import { BookOpen, FileText, BarChart2, AlertCircle, Coffee, Target, Feather, Star, Check } from 'lucide-react';
import { ACTIVITY_TYPES } from '../data/scheduleData';
import { useApp } from '../context/AppContext';
import './DayCard.css';

// Icon mapping
const ICONS = {
    BookOpen,
    FileText,
    BarChart2,
    AlertCircle,
    Coffee,
    Target,
    Feather,
    Star,
};

const DayCard = ({ day, isToday, isCompleted, isPast }) => {
    const { toggleTask } = useApp();
    const activity = ACTIVITY_TYPES[day.activity];
    const IconComponent = ICONS[activity.icon] || BookOpen;

    const handleClick = () => {
        toggleTask(day.date, day.activity);
    };

    return (
        <button
            className={`day-card ${isToday ? 'today' : ''} ${isCompleted ? 'completed' : ''} ${isPast && !isCompleted ? 'missed' : ''}`}
            onClick={handleClick}
            style={{ '--activity-color': activity.color }}
        >
            <div className="day-header">
                <span className="day-name">{day.day}</span>
                <span className="day-date">{day.date.split('-')[2]}</span>
            </div>

            <div className="day-content">
                <div className="activity-icon">
                    {isCompleted ? (
                        <div className="check-icon">
                            <Check size={16} />
                        </div>
                    ) : (
                        <IconComponent size={18} />
                    )}
                </div>
                <span className="activity-label">{activity.short}</span>
            </div>

            <div className="day-xp">
                <span className="xp-value mono">+{activity.xp}</span>
                <span className="xp-label">XP</span>
            </div>
        </button>
    );
};

export default DayCard;
