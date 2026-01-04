import { CheckCircle, Flame, TrendingUp, Zap, Target, BarChart2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCHEDULE_DATA } from '../data/scheduleData';
import './Analytics.css';

const Analytics = () => {
    const { stats, completedTasks, testScores, getCurrentRank, getXPProgress } = useApp();

    // Calculate total days in schedule
    const totalDays = SCHEDULE_DATA.reduce((acc, week) => acc + week.days.length, 0);
    const completedCount = Object.keys(completedTasks).length;
    const progressPercent = Math.round((completedCount / totalDays) * 100);

    // Get rank info
    const rank = getCurrentRank();
    const xpProgress = getXPProgress();

    // Calculate average score
    const avgScore = testScores.length > 0
        ? Math.round(testScores.reduce((acc, s) => acc + s.total, 0) / testScores.length)
        : 0;

    // Best score
    const bestScore = testScores.length > 0
        ? Math.max(...testScores.map((s) => s.total))
        : 0;

    const statCards = [
        {
            icon: CheckCircle,
            label: 'Days Completed',
            value: completedCount,
            subValue: `of ${totalDays} days`,
            color: 'green',
        },
        {
            icon: Flame,
            label: 'Current Streak',
            value: stats.streakCurrent,
            subValue: `Best: ${stats.streakMax} days`,
            color: 'orange',
        },
        {
            icon: TrendingUp,
            label: 'Progress',
            value: `${progressPercent}%`,
            subValue: 'Schedule complete',
            color: 'blue',
        },
        {
            icon: Zap,
            label: 'Total XP',
            value: stats.totalXP,
            subValue: rank.name,
            color: 'purple',
        },
        {
            icon: Target,
            label: 'Tests Taken',
            value: testScores.length,
            subValue: avgScore > 0 ? `Avg: ${avgScore}/720` : 'No tests yet',
            color: 'teal',
        },
        {
            icon: BarChart2,
            label: 'Best Score',
            value: bestScore,
            subValue: bestScore > 0 ? `${Math.round((bestScore / 720) * 100)}%` : 'N/A',
            color: 'pink',
        },
    ];

    return (
        <div className="analytics">
            <div className="analytics-header">
                <h2 className="section-title">Analytics Dashboard</h2>
                <p className="section-subtitle">Track your progress and performance at a glance.</p>
            </div>

            <div className="stats-grid">
                {statCards.map((card, index) => (
                    <div key={index} className={`stat-card card color-${card.color}`}>
                        <div className={`stat-icon bg-${card.color}`}>
                            <card.icon size={22} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-value mono">{card.value}</span>
                            <span className="stat-label">{card.label}</span>
                            <span className="stat-subvalue">{card.subValue}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress Overview */}
            <div className="progress-overview card">
                <h3 className="card-title">Overall Progress</h3>

                <div className="progress-bar-large">
                    <div
                        className="progress-fill-large"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <div className="progress-labels">
                    <span>Start: Jan 5</span>
                    <span className="mono">{progressPercent}% Complete</span>
                    <span>NEET: May 4</span>
                </div>

                {/* XP Progress */}
                <div className="xp-progress-section">
                    <div className="xp-header">
                        <span className="rank-display">
                            <span className="rank-icon">{rank.icon}</span>
                            <span className="rank-name">{rank.name}</span>
                        </span>
                        <span className="xp-text mono">{stats.totalXP} XP</span>
                    </div>
                    <div className="xp-bar">
                        <div
                            className="xp-fill"
                            style={{ width: `${xpProgress.percent}%` }}
                        />
                    </div>
                    <p className="xp-description">
                        {xpProgress.current} / {xpProgress.needed} XP to next rank
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
