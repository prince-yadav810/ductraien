import { useMemo } from 'react';
import { SCHEDULE_DATA } from '../data/scheduleData';
import { useApp } from '../context/AppContext';
import DayCard from './DayCard';
import './ScheduleGrid.css';

const ScheduleGrid = () => {
    const { completedTasks } = useApp();

    // Get current date for highlighting
    const today = new Date().toISOString().split('T')[0];

    // Calculate week progress
    const getWeekProgress = (week) => {
        const completedDays = week.days.filter((day) => completedTasks[day.date]).length;
        return Math.round((completedDays / week.days.length) * 100);
    };

    return (
        <div className="schedule-grid">
            <div className="schedule-header">
                <h2 className="section-title">12-Week Revision Schedule</h2>
                <p className="section-subtitle">
                    Click on a day to mark it as completed. Track your progress week by week.
                </p>
            </div>

            <div className="weeks-container">
                {SCHEDULE_DATA.map((week) => {
                    const progress = getWeekProgress(week);
                    // Check if week contains today
                    const isActiveWeek = week.days.some(day => day.date === today);

                    return (
                        <div
                            key={week.week}
                            className={`week-card card ${week.isIntense ? 'intense' : ''} ${week.isFinal ? 'final' : ''} ${isActiveWeek ? 'active-week-bento' : ''}`}
                        >
                            <div className="week-header">
                                <div className="week-info">
                                    <span className="week-number">Week {week.week}</span>
                                    <span className={`phase-badge badge badge-${week.phase.toLowerCase()}`}>
                                        {week.phase}
                                    </span>
                                    {isActiveWeek && <span className="current-badge">Current Week</span>}
                                </div>
                                <div className="week-dates">
                                    {week.startDate.split('-').slice(1).join('/')} - {week.endDate.split('-').slice(1).join('/')}
                                </div>
                            </div>

                            <div className="week-progress-bar">
                                <div
                                    className="week-progress-fill"
                                    style={{ width: `${progress}%` }}
                                />
                                <span className="week-progress-text mono">{progress}%</span>
                            </div>

                            <div className={`days-grid ${isActiveWeek ? 'bento-grid' : ''}`}>
                                {week.days.map((day) => (
                                    <DayCard
                                        key={day.date}
                                        day={day}
                                        isToday={day.date === today}
                                        isCompleted={!!completedTasks[day.date]}
                                        isPast={new Date(day.date) < new Date(today)}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ScheduleGrid;
