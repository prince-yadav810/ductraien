import { CheckCircle, Flame, TrendingUp, Zap, Target, BarChart2, Award, Star, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCHEDULE_DATA, RANKS, ACHIEVEMENTS } from '../data/scheduleData';
import ScoreChart from './ScoreChart';
import Hero from './Hero';
import './Dashboard.css';

const Dashboard = () => {
    const {
        stats,
        completedTasks,
        testScores,
        getCurrentRank,
        getNextRank,
        getXPProgress,
        getUnlockedAchievements
    } = useApp();

    // Calculate stats
    const totalDays = SCHEDULE_DATA.reduce((acc, week) => acc + week.days.length, 0);
    const completedCount = Object.keys(completedTasks).length;
    const progressPercent = Math.round((completedCount / totalDays) * 100);

    const currentRank = getCurrentRank();
    const nextRank = getNextRank();
    const xpProgress = getXPProgress();
    const unlockedAchievements = getUnlockedAchievements();

    const avgScore = testScores.length > 0
        ? Math.round(testScores.reduce((acc, s) => acc + s.total, 0) / testScores.length)
        : 0;

    const bestScore = testScores.length > 0
        ? Math.max(...testScores.map((s) => s.total))
        : 0;

    // Quick Stats Cards
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
            subValue: currentRank.name,
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
        <div className="dashboard fade-in">
            {/* Hero Section */}
            <Hero />

            {/* Header */}
            <div className="dashboard-header">
                <h2 className="section-title">Dashboard</h2>
                <p className="section-subtitle">Your complete overview at a glance</p>
            </div>

            {/* Quick Stats Grid */}
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
                            <span className="rank-icon">{currentRank.icon}</span>
                            <span className="rank-name">{currentRank.name}</span>
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

            {/* Score Chart */}
            {testScores.length > 0 && (
                <div className="score-chart-section">
                    <ScoreChart />
                </div>
            )}

            {/* Rank Progression */}
            <div className="ranks-overview card">
                <h3 className="card-title">Rank Progression</h3>
                <div className="ranks-list">
                    {RANKS.map((rank) => {
                        const isUnlocked = stats.totalXP >= rank.minXP;
                        const isCurrent = rank.name === currentRank.name;

                        return (
                            <div
                                key={rank.name}
                                className={`rank-item ${isUnlocked ? 'unlocked' : ''} ${isCurrent ? 'current' : ''}`}
                            >
                                <div className="rank-item-icon" style={{ color: isUnlocked ? rank.color : undefined }}>
                                    {rank.icon}
                                </div>
                                <div className="rank-item-info">
                                    <span className="rank-item-name">{rank.name}</span>
                                    <span className="rank-item-xp mono">{rank.minXP} XP</span>
                                </div>
                                {!isUnlocked && <Lock size={14} className="lock-icon" />}
                                {isCurrent && <span className="current-badge">Current</span>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Achievements */}
            <div className="achievements card">
                <h3 className="card-title">
                    <Award size={18} />
                    Achievements
                    <span className="achievement-count">
                        {unlockedAchievements.length} / {ACHIEVEMENTS.length}
                    </span>
                </h3>

                <div className="achievements-grid">
                    {ACHIEVEMENTS.map((achievement) => {
                        const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);

                        return (
                            <div
                                key={achievement.id}
                                className={`achievement-item ${isUnlocked ? 'unlocked' : ''}`}
                            >
                                <span className="achievement-icon">{achievement.icon}</span>
                                <div className="achievement-info">
                                    <span className="achievement-name">{achievement.name}</span>
                                    <span className="achievement-desc">{achievement.description}</span>
                                </div>
                                {isUnlocked && (
                                    <Star size={16} className="achievement-star" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* XP Breakdown */}
            <div className="xp-breakdown card">
                <h3 className="card-title">XP System</h3>
                <div className="xp-rules">
                    <div className="xp-rule">
                        <span className="rule-activity">Mock Test / Test</span>
                        <span className="rule-xp badge badge-orange">+50 XP</span>
                    </div>
                    <div className="xp-rule">
                        <span className="rule-activity">Analysis</span>
                        <span className="rule-xp badge badge-purple">+30 XP</span>
                    </div>
                    <div className="xp-rule">
                        <span className="rule-activity">Backlog</span>
                        <span className="rule-xp badge badge-red">+20 XP</span>
                    </div>
                    <div className="xp-rule">
                        <span className="rule-activity">Revision</span>
                        <span className="rule-xp badge badge-blue">+10 XP</span>
                    </div>
                    <div className="xp-rule">
                        <span className="rule-activity">Rest Day</span>
                        <span className="rule-xp badge badge-green">+5 XP</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
