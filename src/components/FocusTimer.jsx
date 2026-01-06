import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen, Volume2, VolumeX, BarChart2 } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import * as firebaseService from '../services/firebaseService';
import { useApp } from '../context/AppContext';
import './FocusTimer.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FocusTimer = () => {
    // Use context state for timer persistence across tab switches
    const { timerState, setTimerState } = useApp();

    const [focusSessions, setFocusSessions] = useState([]);
    const [isMuted, setIsMuted] = useState(false);

    // Destructure timer state
    const {
        mode,
        timeLeft,
        isRunning,
        sessionsCompleted,
        selectedWorkDuration,
        selectedBreakDuration,
        expectedEndTime
    } = timerState;

    // Helper to update timer state
    const updateTimer = (updates) => {
        setTimerState(prev => ({ ...prev, ...updates }));
    };

    // Refs for wake lock and audio
    const wakeLockRef = useRef(null);
    const audioContextRef = useRef(null);

    const durations = {
        work: [25, 50, 90],
        break: [5, 10, 15],
    };

    // Request notification permission on mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // Load focus sessions from Firebase
    useEffect(() => {
        const loadSessions = async () => {
            const sessions = await firebaseService.getFocusSessions();
            setFocusSessions(sessions);
        };
        loadSessions();

        // Set up real-time listener
        const unsub = firebaseService.onFocusSessionsChange((sessions) => {
            setFocusSessions(sessions);
        });

        return () => unsub();
    }, []);

    // Wake Lock API - prevent screen from sleeping
    const requestWakeLock = async () => {
        if ('wakeLock' in navigator) {
            try {
                wakeLockRef.current = await navigator.wakeLock.request('screen');
                console.log('Wake Lock acquired');
            } catch (err) {
                console.log('Wake Lock failed:', err);
            }
        }
    };

    const releaseWakeLock = () => {
        if (wakeLockRef.current) {
            wakeLockRef.current.release();
            wakeLockRef.current = null;
            console.log('Wake Lock released');
        }
    };

    // Play alarm sound using Web Audio API
    const playAlarmSound = useCallback(() => {
        if (isMuted) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!audioContextRef.current) {
                audioContextRef.current = new AudioContext();
            }
            const ctx = audioContextRef.current;

            const playBeep = (frequency, startTime, duration) => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(0.3, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

                oscillator.start(startTime);
                oscillator.stop(startTime + duration);
            };

            const now = ctx.currentTime;
            for (let i = 0; i < 4; i++) {
                playBeep(880, now + i * 0.3, 0.2);
            }

            if ('vibrate' in navigator) {
                navigator.vibrate([200, 100, 200, 100, 200]);
            }
        } catch (e) {
            console.log('Audio not supported:', e);
        }
    }, [isMuted]);

    // Send browser notification
    const sendNotification = useCallback((title, body) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body, icon: '/favicon.ico' });
        }
    }, []);

    // Save completed focus session to Firebase
    const saveSession = useCallback(async (duration, type) => {
        const session = {
            date: new Date().toISOString().split('T')[0],
            duration: duration,
            type: type,
            completedAt: new Date().toISOString()
        };
        await firebaseService.saveFocusSession(session);
    }, []);

    // Handle timer completion
    const handleTimerComplete = useCallback(async () => {
        playAlarmSound();

        if (mode === 'work') {
            await saveSession(selectedWorkDuration, 'work');
            updateTimer({
                sessionsCompleted: sessionsCompleted + 1,
                mode: 'break',
                timeLeft: selectedBreakDuration * 60,
                isRunning: false,
                expectedEndTime: null
            });
            sendNotification('Focus Session Complete! 🎉', 'Time for a break!');
        } else {
            updateTimer({
                mode: 'work',
                timeLeft: selectedWorkDuration * 60,
                isRunning: false,
                expectedEndTime: null
            });
            sendNotification('Break Over! ☕', 'Ready to focus again?');
        }
        releaseWakeLock();
    }, [mode, selectedWorkDuration, selectedBreakDuration, sessionsCompleted, playAlarmSound, saveSession, sendNotification]);

    // Watch for timer completion (timer ticks in context now)
    useEffect(() => {
        if (timeLeft === 0 && isRunning) {
            handleTimerComplete();
        }
    }, [timeLeft, isRunning, handleTimerComplete]);

    // Handle visibility change (tab switch / background)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isRunning) {
                updateTimer({ expectedEndTime: Date.now() + (timeLeft * 1000) });
            } else if (!document.hidden && isRunning && expectedEndTime) {
                const now = Date.now();
                const remaining = Math.max(0, Math.floor((expectedEndTime - now) / 1000));
                updateTimer({ timeLeft: remaining });

                if (remaining <= 0) {
                    handleTimerComplete();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isRunning, timeLeft, expectedEndTime, handleTimerComplete]);

    // Re-acquire wake lock when regaining visibility
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (!document.hidden && isRunning) {
                await requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isRunning]);

    const toggleTimer = async () => {
        if (!isRunning) {
            await requestWakeLock();
            updateTimer({
                isRunning: true,
                startTime: Date.now(),
                expectedEndTime: Date.now() + (timeLeft * 1000)
            });
        } else {
            releaseWakeLock();
            updateTimer({
                isRunning: false,
                expectedEndTime: null
            });
        }
    };

    const resetTimer = () => {
        releaseWakeLock();
        updateTimer({
            isRunning: false,
            expectedEndTime: null,
            timeLeft: mode === 'work' ? selectedWorkDuration * 60 : selectedBreakDuration * 60
        });
    };

    const selectWorkDuration = (duration) => {
        releaseWakeLock();
        updateTimer({
            selectedWorkDuration: duration,
            mode: 'work',
            timeLeft: duration * 60,
            isRunning: false,
            expectedEndTime: null
        });
    };

    const selectBreakDuration = (duration) => {
        releaseWakeLock();
        updateTimer({
            selectedBreakDuration: duration,
            mode: 'break',
            timeLeft: duration * 60,
            isRunning: false,
            expectedEndTime: null
        });
    };

    // Manual mode toggle
    const toggleMode = () => {
        releaseWakeLock();
        const newMode = mode === 'work' ? 'break' : 'work';
        updateTimer({
            mode: newMode,
            timeLeft: newMode === 'work' ? selectedWorkDuration * 60 : selectedBreakDuration * 60,
            isRunning: false,
            expectedEndTime: null
        });
    };

    // Calculate daily focus stats for chart
    const getDailyFocusData = () => {
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

            const dayMinutes = focusSessions
                .filter(s => s.date === dateStr && s.type === 'work')
                .reduce((sum, s) => sum + (s.duration || 0), 0);

            last7Days.push({ dateStr, dayName, minutes: dayMinutes });
        }
        return last7Days;
    };

    const dailyData = getDailyFocusData();
    const todayFocusMinutes = dailyData[6]?.minutes || 0;

    const chartData = {
        labels: dailyData.map(d => d.dayName),
        datasets: [{
            label: 'Focus Time (min)',
            data: dailyData.map(d => d.minutes),
            backgroundColor: 'rgba(0, 122, 255, 0.7)',
            borderRadius: 6,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const hours = Math.floor(context.raw / 60);
                        const mins = context.raw % 60;
                        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
                    }
                }
            }
        },
        scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }
        }
    };

    // Format time into digits
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const minTens = Math.floor(minutes / 10);
    const minOnes = minutes % 10;
    const secTens = Math.floor(seconds / 10);
    const secOnes = seconds % 10;

    // Progress percentage
    const totalSeconds = mode === 'work' ? selectedWorkDuration * 60 : selectedBreakDuration * 60;
    const progressPercent = (timeLeft / totalSeconds) * 100;

    return (
        <div className="focus-timer-fullwidth">
            {/* Full-width flip clock display */}
            <div className={`flip-clock-container ${mode === 'break' ? 'break-mode' : ''}`}>
                <div className="flip-clock-content">
                    <div className="mode-indicator">
                        {mode === 'work' ? (
                            <>
                                <BookOpen size={24} />
                                <span>Focus Time</span>
                            </>
                        ) : (
                            <>
                                <Coffee size={24} />
                                <span>Break Time</span>
                            </>
                        )}
                        <button
                            className="mode-toggle-btn"
                            onClick={toggleMode}
                            title="Switch mode"
                        >
                            {mode === 'work' ? <Coffee size={16} /> : <BookOpen size={16} />}
                        </button>
                        <button
                            className="mute-btn"
                            onClick={() => setIsMuted(!isMuted)}
                            title={isMuted ? 'Unmute' : 'Mute'}
                        >
                            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                    </div>

                    <div className="flip-clock">
                        <div className="flip-digit">
                            <span className="digit">{minTens}</span>
                        </div>
                        <div className="flip-digit">
                            <span className="digit">{minOnes}</span>
                        </div>
                        <div className="flip-separator">:</div>
                        <div className="flip-digit">
                            <span className="digit">{secTens}</span>
                        </div>
                        <div className="flip-digit">
                            <span className="digit">{secOnes}</span>
                        </div>
                    </div>

                    <div className="timer-progress">
                        <div
                            className="progress-fill"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>

                    <div className="flip-controls">
                        <button
                            className="flip-btn reset"
                            onClick={resetTimer}
                            title="Reset"
                        >
                            <RotateCcw size={24} />
                        </button>
                        <button
                            className={`flip-btn play ${isRunning ? 'running' : ''}`}
                            onClick={toggleTimer}
                        >
                            {isRunning ? <Pause size={32} /> : <Play size={32} />}
                        </button>
                        <div className="session-counter">
                            <span className="session-number">{sessionsCompleted}</span>
                            <span className="session-label">sessions</span>
                        </div>
                    </div>

                    {/* Duration selection */}
                    <div className="duration-section">
                        <div className="duration-group">
                            <span className="duration-label">Focus</span>
                            <div className="duration-pills">
                                {durations.work.map((d) => (
                                    <button
                                        key={d}
                                        className={`duration-pill ${selectedWorkDuration === d && mode === 'work' ? 'active' : ''}`}
                                        onClick={() => selectWorkDuration(d)}
                                    >
                                        {d}m
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="duration-group">
                            <span className="duration-label">Break</span>
                            <div className="duration-pills">
                                {durations.break.map((d) => (
                                    <button
                                        key={d}
                                        className={`duration-pill break ${selectedBreakDuration === d && mode === 'break' ? 'active' : ''}`}
                                        onClick={() => selectBreakDuration(d)}
                                    >
                                        {d}m
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Focus Stats */}
            <div className="focus-stats-section">
                <div className="focus-stats-header">
                    <h3><BarChart2 size={20} /> Daily Focus Time</h3>
                    <div className="today-focus">
                        Today: <strong>{Math.floor(todayFocusMinutes / 60)}h {todayFocusMinutes % 60}m</strong>
                    </div>
                </div>
                <div className="focus-chart-container">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>

            {/* Tips section */}
            <div className="timer-tips-section">
                <h3>🍅 Pomodoro Technique</h3>
                <div className="tips-grid">
                    <div className="tip-item">
                        <span className="tip-number">1</span>
                        <p>Choose a task and set the timer for 25 minutes</p>
                    </div>
                    <div className="tip-item">
                        <span className="tip-number">2</span>
                        <p>Work with full focus until the timer rings</p>
                    </div>
                    <div className="tip-item">
                        <span className="tip-number">3</span>
                        <p>Take a short 5-minute break</p>
                    </div>
                    <div className="tip-item">
                        <span className="tip-number">4</span>
                        <p>After 4 sessions, take a longer 15-30 min break</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FocusTimer;
