import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen } from 'lucide-react';
import './FocusTimer.css';

const FocusTimer = () => {
    const [mode, setMode] = useState('work'); // 'work' or 'break'
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
    const [isRunning, setIsRunning] = useState(false);
    const [sessionsCompleted, setSessions] = useState(0);
    const [selectedDuration, setSelectedDuration] = useState(25);

    const durations = {
        work: [25, 50, 90],
        break: [5, 10, 15],
    };

    useEffect(() => {
        let interval = null;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Timer completed
            playSound();
            if (mode === 'work') {
                setSessions((prev) => prev + 1);
                setMode('break');
                setTimeLeft(5 * 60);
            } else {
                setMode('work');
                setTimeLeft(selectedDuration * 60);
            }
            setIsRunning(false);
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft, mode, selectedDuration]);

    const playSound = () => {
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQAAAH+BhIaDgH5/gYKBf35+f4CAgICAgICAgICAgICAgICAgH9/f39/f39/f4CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIB/f39/gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIA');
            audio.volume = 0.5;
            audio.play();
        } catch (e) {
            console.log('Sound not supported');
        }
    };

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(selectedDuration * 60);
        setMode('work');
    };

    const selectDuration = (duration) => {
        setSelectedDuration(duration);
        setTimeLeft(duration * 60);
        setIsRunning(false);
        setMode('work');
    };

    // Format time into digits
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const minTens = Math.floor(minutes / 10);
    const minOnes = minutes % 10;
    const secTens = Math.floor(seconds / 10);
    const secOnes = seconds % 10;

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
                    </div>

                    {/* ... inside flip-clock-content ... */}
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
                            style={{ width: `${(timeLeft / (selectedDuration * 60)) * 100}%` }}
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

                    <div className="duration-pills">
                        {durations.work.map((d) => (
                            <button
                                key={d}
                                className={`duration-pill ${selectedDuration === d ? 'active' : ''}`}
                                onClick={() => selectDuration(d)}
                            >
                                {d} min
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tips section below */}
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
