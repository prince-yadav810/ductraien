import { useState } from 'react';
import { Plus, BarChart2, CheckCircle, TrendingUp, Edit2, Target, XCircle } from 'lucide-react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useApp } from '../context/AppContext';
import './QuestionTracker.css';

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

const SUBJECTS = [
    { id: 'physics', name: 'Physics', color: '#007aff', bgColor: 'rgba(0, 122, 255, 0.1)' },
    { id: 'chemistry', name: 'Chemistry', color: '#ff9500', bgColor: 'rgba(255, 149, 0, 0.1)' },
    { id: 'botany', name: 'Botany', color: '#34c759', bgColor: 'rgba(52, 199, 89, 0.1)' },
    { id: 'zoology', name: 'Zoology', color: '#af52de', bgColor: 'rgba(175, 82, 222, 0.1)' },
];

const QuestionTracker = () => {
    const { dailyQuestions, addDailyQuestions } = useApp();

    const [formData, setFormData] = useState({
        physics: { correct: '', wrong: '' },
        chemistry: { correct: '', wrong: '' },
        botany: { correct: '', wrong: '' },
        zoology: { correct: '', wrong: '' },
    });
    const [isEditing, setIsEditing] = useState(false);

    // Check if today is logged
    const getTodayEntry = () => {
        const today = new Date().toISOString().split('T')[0];
        return dailyQuestions.find(entry => entry.date === today);
    };

    // Calculate overall stats
    const totalQuestions = dailyQuestions.reduce((sum, e) => sum + (e.total || 0), 0);
    const totalCorrect = dailyQuestions.reduce((sum, e) => sum + (e.totalCorrect || 0), 0);
    const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const streak = dailyQuestions.length;

    const handleInputChange = (subject, type, value) => {
        setFormData(prev => ({
            ...prev,
            [subject]: { ...prev[subject], [type]: value }
        }));
    };

    const handleEditClick = () => {
        const entry = getTodayEntry();
        if (entry) {
            setFormData({
                physics: { correct: entry.physics?.correct || '', wrong: entry.physics?.wrong || '' },
                chemistry: { correct: entry.chemistry?.correct || '', wrong: entry.chemistry?.wrong || '' },
                botany: { correct: entry.botany?.correct || '', wrong: entry.botany?.wrong || '' },
                zoology: { correct: entry.zoology?.correct || '', wrong: entry.zoology?.wrong || '' },
            });
            setIsEditing(true);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            physics: { correct: parseInt(formData.physics.correct) || 0, wrong: parseInt(formData.physics.wrong) || 0 },
            chemistry: { correct: parseInt(formData.chemistry.correct) || 0, wrong: parseInt(formData.chemistry.wrong) || 0 },
            botany: { correct: parseInt(formData.botany.correct) || 0, wrong: parseInt(formData.botany.wrong) || 0 },
            zoology: { correct: parseInt(formData.zoology.correct) || 0, wrong: parseInt(formData.zoology.wrong) || 0 },
        };
        addDailyQuestions(data);
        setFormData({
            physics: { correct: '', wrong: '' },
            chemistry: { correct: '', wrong: '' },
            botany: { correct: '', wrong: '' },
            zoology: { correct: '', wrong: '' },
        });
        setIsEditing(false);
    };

    // Prepare chart data for last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const entry = dailyQuestions.find(q => q.date === dateStr);
        last7Days.push({ dateStr, dayName, entry });
    }

    // Subject-specific chart data generator
    const getSubjectChartData = (subjectId) => ({
        labels: last7Days.map(d => d.dayName),
        datasets: [
            {
                label: 'Correct',
                data: last7Days.map(d => d.entry?.[subjectId]?.correct || 0),
                backgroundColor: '#34c759',
                borderRadius: 4,
            },
            {
                label: 'Wrong',
                data: last7Days.map(d => d.entry?.[subjectId]?.wrong || 0),
                backgroundColor: '#ff3b30',
                borderRadius: 4,
            },
        ],
    });

    // Combined chart data (stacked bar)
    const combinedChartData = {
        labels: last7Days.map(d => d.dayName),
        datasets: SUBJECTS.map(sub => ({
            label: sub.name,
            data: last7Days.map(d => d.entry?.[sub.id]?.total || 0),
            backgroundColor: sub.color,
            borderRadius: 4,
        })),
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { stacked: true, grid: { display: false } },
            y: { stacked: true, beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
        },
    };

    const subjectChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { stacked: true, grid: { display: false } },
            y: { stacked: true, beginAtZero: true, ticks: { stepSize: 5 }, grid: { color: 'rgba(0,0,0,0.05)' } },
        },
    };

    const todayEntry = getTodayEntry();
    const showForm = !todayEntry || isEditing;

    return (
        <div className="question-tracker-v2">
            {/* Stats Overview */}
            <div className="qt-stats-row">
                <div className="qt-stat blue">
                    <Target size={20} />
                    <div className="qt-stat-info">
                        <span className="qt-stat-value">{totalQuestions}</span>
                        <span className="qt-stat-label">Total Questions</span>
                    </div>
                </div>
                <div className="qt-stat green">
                    <CheckCircle size={20} />
                    <div className="qt-stat-info">
                        <span className="qt-stat-value">{overallAccuracy}%</span>
                        <span className="qt-stat-label">Accuracy</span>
                    </div>
                </div>
                <div className="qt-stat purple">
                    <TrendingUp size={20} />
                    <div className="qt-stat-info">
                        <span className="qt-stat-value">{streak} days</span>
                        <span className="qt-stat-label">Streak</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="qt-main-grid">
                {/* Input Form */}
                <div className="qt-form-section card-box">
                    <div className="qt-form-header">
                        <h3>Log Today's Questions</h3>
                        {todayEntry && !isEditing && (
                            <button className="qt-edit-btn" onClick={handleEditClick}>
                                <Edit2 size={14} /> Edit
                            </button>
                        )}
                    </div>

                    {showForm ? (
                        <form onSubmit={handleSubmit} className="qt-form">
                            <div className="qt-form-grid">
                                {SUBJECTS.map(sub => (
                                    <div key={sub.id} className="qt-subject-row" style={{ '--sub-color': sub.color, '--sub-bg': sub.bgColor }}>
                                        <span className="qt-subject-name">{sub.name}</span>
                                        <div className="qt-input-pair">
                                            <div className="qt-input-wrapper correct">
                                                <CheckCircle size={14} />
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    placeholder="0"
                                                    value={formData[sub.id].correct}
                                                    onChange={(e) => handleInputChange(sub.id, 'correct', e.target.value.replace(/[^0-9]/g, ''))}
                                                />
                                            </div>
                                            <div className="qt-input-wrapper wrong">
                                                <XCircle size={14} />
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    placeholder="0"
                                                    value={formData[sub.id].wrong}
                                                    onChange={(e) => handleInputChange(sub.id, 'wrong', e.target.value.replace(/[^0-9]/g, ''))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="qt-form-actions">
                                {isEditing && (
                                    <button type="button" className="qt-cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                                )}
                                <button type="submit" className="qt-submit-btn">
                                    {isEditing ? 'Update Log' : 'Log Questions'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="qt-logged-state">
                            <div className="qt-logged-header">
                                <CheckCircle size={24} className="success-icon" />
                                <h4>Today's Log</h4>
                            </div>
                            <div className="qt-logged-stats">
                                {SUBJECTS.map(sub => {
                                    const subData = todayEntry[sub.id] || { correct: 0, wrong: 0 };
                                    const subTotal = subData.correct + subData.wrong;
                                    const subAccuracy = subTotal > 0 ? Math.round((subData.correct / subTotal) * 100) : 0;
                                    return (
                                        <div key={sub.id} className="qt-logged-subject" style={{ '--sub-color': sub.color, '--sub-bg': sub.bgColor }}>
                                            <span className="qt-logged-subject-name">{sub.name}</span>
                                            <div className="qt-logged-subject-stats">
                                                <span className="qt-logged-correct">✓ {subData.correct}</span>
                                                <span className="qt-logged-wrong">✗ {subData.wrong}</span>
                                                <span className="qt-logged-accuracy">{subAccuracy}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="qt-logged-total">
                                <span>Total: <strong>{todayEntry.total}</strong></span>
                                <span>Accuracy: <strong>{todayEntry.accuracy}%</strong></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Combined Chart */}
                <div className="qt-combined-chart card-box">
                    <h3>Weekly Overview (All Subjects)</h3>
                    <div className="chart-container weekly-chart">
                        <Bar data={combinedChartData} options={{ ...chartOptions, plugins: { legend: { display: true, position: 'bottom' } } }} />
                    </div>
                </div>
            </div>

            {/* Subject-wise Charts */}
            <div className="qt-subject-charts">
                {SUBJECTS.map(sub => (
                    <div key={sub.id} className="qt-subject-chart card-box" style={{ '--sub-color': sub.color }}>
                        <h4>{sub.name}</h4>
                        <div className="chart-container" style={{ height: '200px' }}>
                            <Bar data={getSubjectChartData(sub.id)} options={subjectChartOptions} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionTracker;
