import { useState, useEffect } from 'react';
import { CheckCircle, Flame, TrendingUp, Zap, Target, BarChart2, Check, FlaskConical, Microscope, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCHEDULE_DATA, ACTIVITY_TYPES } from '../data/scheduleData';
import ScoreChart from './ScoreChart';
import Hero from './Hero';
import './Dashboard.css';

const SUBJECT_STYLES = {
    'PHY_B1': { color: '#007aff', icon: Zap, label: 'Physics' },
    'PHY_B2': { color: '#007aff', icon: Zap, label: 'Physics' },
    'PHY_B3': { color: '#007aff', icon: Zap, label: 'Physics' },
    'PHY_B4': { color: '#007aff', icon: Zap, label: 'Physics' },
    'PHY_PYQ': { color: '#007aff', icon: Zap, label: 'Physics' },
    'PHY_FINAL': { color: '#007aff', icon: Zap, label: 'Physics' },
    'ZOOLOGY': { color: '#8b5cf6', icon: Microscope, label: 'Zoology' },
    'BOTANY': { color: '#16a34a', icon: Leaf, label: 'Botany' },
    'CHEM': { color: '#ea580c', icon: FlaskConical, label: 'Chemistry' },
};

const Dashboard = () => {
    const {
        stats,
        completedTasks,
        testScores,
    } = useApp();

    // 2. Calculate Stats
    const totalDays = 31; // As per schedule update
    const completedCount = Object.keys(completedTasks).reduce((count, key) => {
        if (key.endsWith('_fixed')) {
            const date = key.split('_')[0];
            if (completedTasks[`${date}_alt`] && completedTasks[`${date}_mock`]) {
                return count + 1;
            }
        }
        return count;
    }, 0);

    const progressPercent = Math.round((completedCount / totalDays) * 100);

    const avgScore = testScores.length > 0
        ? Math.round(testScores.reduce((acc, s) => acc + s.total, 0) / testScores.length)
        : 0;

    const bestScore = testScores.length > 0
        ? Math.max(...testScores.map((s) => s.total))
        : 0;

    // 3. Today's Tasks Setup
    const todayStr = new Date().toISOString().split('T')[0];
    let todaysTasks = null;
    for (const week of SCHEDULE_DATA) {
        const day = week.days.find(d => d.date === todayStr);
        if (day) {
            todaysTasks = day;
            break;
        }
    }

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
            subValue: '',
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

    const renderTaskRow = (subjectKey, label, taskType) => {
        if (!subjectKey) return null;
        
        const isDone = !!completedTasks[`${todayStr}_${taskType}`];
        let style = { color: '#dc2626', icon: Target }; // default for Mock
        let displayLabel = label;

        if (taskType !== 'mock') {
            style = SUBJECT_STYLES[subjectKey] || { color: '#007aff', icon: Zap };
            displayLabel = ACTIVITY_TYPES[subjectKey]?.short || subjectKey;
        }

        const IconComponent = style.icon;

        return (
            <div className={`today-task-row ${isDone ? 'done' : ''}`} key={taskType}>
                <div className="task-row-info">
                    <div className="task-row-icon" style={{ color: style.color }}>
                        <IconComponent size={20} />
                    </div>
                    <span className="task-row-label">{displayLabel}</span>
                </div>
                <div className="task-row-status">
                    {isDone ? (
                        <CheckCircle size={20} className="status-icon done-icon" />
                    ) : (
                        <div className="status-circle" />
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="dashboard fade-in">
            {/* Hero Section */}
            <Hero />

            {/* Today's Tasks */}
            <div className="todays-tasks-card card">
                <h3 className="card-title">Today's Tasks</h3>
                {todaysTasks ? (
                    <div className="todays-tasks-list">
                        {renderTaskRow(todaysTasks.fixedSubject, '', 'fixed')}
                        {renderTaskRow(todaysTasks.altSubject, '', 'alt')}
                        {renderTaskRow('MOCK', 'Mock Test', 'mock')}
                    </div>
                ) : (
                    <p className="no-tasks-message">No tasks scheduled for today.</p>
                )}
            </div>

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
                            {card.subValue && <span className="stat-subvalue">{card.subValue}</span>}
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
                    <span>Start: May 15</span>
                    <span className="mono">{progressPercent}% Complete</span>
                    <span>NEET: June 15</span>
                </div>
            </div>

            {/* Score Chart */}
            {testScores.length > 0 && (
                <div className="score-chart-section">
                    <ScoreChart />
                </div>
            )}

        </div>
    );
};

export default Dashboard;
