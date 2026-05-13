import { useMemo } from 'react';
import { SCHEDULE_DATA } from '../data/scheduleData';
import { useApp } from '../context/AppContext';
import DayCard from './DayCard';
import './ScheduleGrid.css';

const ScheduleGrid = () => {
    const { completedTasks } = useApp();

    const today = new Date().toISOString().split('T')[0];

    const getWeekProgress = (week) => {
        const completedDays = week.days.filter((day) => 
            completedTasks[`${day.date}_fixed`] && 
            completedTasks[`${day.date}_alt`] && 
            completedTasks[`${day.date}_mock`]
        ).length;
        return Math.round((completedDays / week.days.length) * 100);
    };

    const totalDaysCount = 31;
    const completedDaysCount = Object.keys(completedTasks).reduce((count, key) => {
        if (key.endsWith('_fixed')) {
            const date = key.split('_')[0];
            if (completedTasks[`${date}_alt`] && completedTasks[`${date}_mock`]) {
                return count + 1;
            }
        }
        return count;
    }, 0);

    const totalProgress = Math.round((completedDaysCount / totalDaysCount) * 100);

    const getProgressColor = (percent) => {
        if (percent < 40) return '#ef4444'; // red
        if (percent < 80) return '#eab308'; // yellow
        return '#22c55e'; // green
    };

    return (
        <div className="schedule-grid">
            <div className="schedule-header">
                <h2 className="section-title">31-Day NEET Sprint</h2>
                <p className="section-subtitle">
                    May 15 → June 15 · No rest days
                </p>
                <div className="overall-progress-container">
                    <div className="overall-progress-bar">
                        <div 
                            className="overall-progress-fill" 
                            style={{ width: `${totalProgress}%` }}
                        />
                    </div>
                    <span className="overall-progress-text mono">{completedDaysCount} / {totalDaysCount} days completed</span>
                </div>
            </div>

            <div className="weeks-container">
                {SCHEDULE_DATA.map((week) => {
                    const isActiveWeek = week.days.some(day => day.date === today);

                    return (
                        <div key={week.week} className="week-section">
                            <div className="week-divider">
                                <div className="week-divider-label">
                                    Week {week.week} · {week.phase} · {week.startDate.split('-').slice(1).join('/')} - {week.endDate.split('-').slice(1).join('/')}
                                </div>
                                <div className="week-divider-line" />
                            </div>

                            <div className="days-grid">
                                {week.days.map((day) => (
                                    <DayCard
                                        key={day.date}
                                        day={day}
                                        isToday={day.date === today}
                                        isFixedDone={!!completedTasks[`${day.date}_fixed`]}
                                        isAltDone={!!completedTasks[`${day.date}_alt`]}
                                        isMockDone={!!completedTasks[`${day.date}_mock`]}
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
