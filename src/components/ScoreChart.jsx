import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useApp } from '../context/AppContext';
import './ScoreChart.css';

// Register Chart.js components
Chart.register(...registerables);

const ScoreChart = () => {
    const { testScores } = useApp();
    const lineChartRef = useRef(null);
    const barChartRef = useRef(null);
    const lineChartInstance = useRef(null);
    const barChartInstance = useRef(null);

    // Prepare data for charts
    const sortedScores = [...testScores].sort((a, b) => new Date(a.date) - new Date(b.date));

    useEffect(() => {
        // Destroy existing charts
        if (lineChartInstance.current) {
            lineChartInstance.current.destroy();
        }
        if (barChartInstance.current) {
            barChartInstance.current.destroy();
        }

        if (sortedScores.length === 0) return;

        // Line Chart - Score Progression
        const lineCtx = lineChartRef.current?.getContext('2d');
        if (lineCtx) {
            lineChartInstance.current = new Chart(lineCtx, {
                type: 'line',
                data: {
                    labels: sortedScores.map(s => new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
                    datasets: [
                        {
                            label: 'Total Score',
                            data: sortedScores.map(s => s.total),
                            borderColor: '#007aff',
                            backgroundColor: 'rgba(0, 122, 255, 0.1)',
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#007aff',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            backgroundColor: '#1d1d1f',
                            titleFont: { family: 'Inter', size: 13 },
                            bodyFont: { family: 'JetBrains Mono', size: 14 },
                            padding: 12,
                            cornerRadius: 8,
                            callbacks: {
                                label: (context) => `Score: ${context.raw}/720`,
                            },
                        },
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: {
                                font: { family: 'Inter', size: 11 },
                                color: '#86868b',
                            },
                        },
                        y: {
                            min: 0,
                            max: 720,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                            },
                            ticks: {
                                font: { family: 'JetBrains Mono', size: 11 },
                                color: '#86868b',
                            },
                        },
                    },
                },
            });
        }

        // Bar Chart - Latest Score Subject Breakdown
        const latestScore = sortedScores[sortedScores.length - 1];
        const barCtx = barChartRef.current?.getContext('2d');
        if (barCtx && latestScore) {
            barChartInstance.current = new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: ['Physics', 'Chemistry', 'Biology'],
                    datasets: [
                        {
                            label: 'Your Score',
                            data: [latestScore.physics, latestScore.chemistry, latestScore.biology],
                            backgroundColor: ['rgba(0, 122, 255, 0.8)', 'rgba(52, 199, 89, 0.8)', 'rgba(175, 82, 222, 0.8)'],
                            borderRadius: 8,
                        },
                        {
                            label: 'Max Score',
                            data: [180, 180, 360],
                            backgroundColor: ['rgba(0, 122, 255, 0.15)', 'rgba(52, 199, 89, 0.15)', 'rgba(175, 82, 222, 0.15)'],
                            borderRadius: 8,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                font: { family: 'Inter', size: 12 },
                                color: '#86868b',
                                usePointStyle: true,
                                padding: 20,
                            },
                        },
                        tooltip: {
                            backgroundColor: '#1d1d1f',
                            titleFont: { family: 'Inter', size: 13 },
                            bodyFont: { family: 'JetBrains Mono', size: 14 },
                            padding: 12,
                            cornerRadius: 8,
                        },
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: {
                                font: { family: 'Inter', size: 12 },
                                color: '#86868b',
                            },
                        },
                        y: {
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                            },
                            ticks: {
                                font: { family: 'JetBrains Mono', size: 11 },
                                color: '#86868b',
                            },
                        },
                    },
                },
            });
        }

        return () => {
            if (lineChartInstance.current) lineChartInstance.current.destroy();
            if (barChartInstance.current) barChartInstance.current.destroy();
        };
    }, [sortedScores]);

    // Calculate averages
    const avgPhysics = testScores.length > 0
        ? Math.round(testScores.reduce((acc, s) => acc + s.physics, 0) / testScores.length)
        : 0;
    const avgChemistry = testScores.length > 0
        ? Math.round(testScores.reduce((acc, s) => acc + s.chemistry, 0) / testScores.length)
        : 0;
    const avgBiology = testScores.length > 0
        ? Math.round(testScores.reduce((acc, s) => acc + s.biology, 0) / testScores.length)
        : 0;

    return (
        <div className="score-chart">
            {testScores.length === 0 ? (
                <div className="no-data card">
                    <h3>No Test Scores Yet</h3>
                    <p>Log your first test score to see charts and analytics.</p>
                </div>
            ) : (
                <>
                    {/* Score Progression */}
                    <div className="chart-card card">
                        <div className="chart-header">
                            <h3>Score Progression</h3>
                            <span className="chart-count">{testScores.length} tests logged</span>
                        </div>
                        <div className="chart-container line-chart">
                            <canvas ref={lineChartRef}></canvas>
                        </div>
                    </div>

                    {/* Subject Breakdown */}
                    <div className="chart-card card">
                        <div className="chart-header">
                            <h3>Subject Performance (Latest Test)</h3>
                        </div>
                        <div className="chart-container bar-chart">
                            <canvas ref={barChartRef}></canvas>
                        </div>
                    </div>

                    {/* Average Stats */}
                    <div className="avg-stats card">
                        <div className="chart-header">
                            <h3>Average Scores</h3>
                        </div>
                        <div className="avg-grid">
                            <div className="avg-item phy">
                                <span className="avg-label">Physics</span>
                                <span className="avg-value mono">{avgPhysics}/180</span>
                                <div className="avg-bar">
                                    <div className="avg-fill" style={{ width: `${(avgPhysics / 180) * 100}%` }}></div>
                                </div>
                            </div>
                            <div className="avg-item chem">
                                <span className="avg-label">Chemistry</span>
                                <span className="avg-value mono">{avgChemistry}/180</span>
                                <div className="avg-bar">
                                    <div className="avg-fill" style={{ width: `${(avgChemistry / 180) * 100}%` }}></div>
                                </div>
                            </div>
                            <div className="avg-item bio">
                                <span className="avg-label">Biology</span>
                                <span className="avg-value mono">{avgBiology}/360</span>
                                <div className="avg-bar">
                                    <div className="avg-fill" style={{ width: `${(avgBiology / 360) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ScoreChart;
