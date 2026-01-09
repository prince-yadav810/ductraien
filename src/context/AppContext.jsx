import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ACTIVITY_TYPES, RANKS, ACHIEVEMENTS } from '../data/scheduleData';
import * as firebaseService from '../services/firebaseService';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

// LocalStorage keys for migration
const STORAGE_KEYS = {
    COMPLETED: 'neet_completed_tasks',
    SCORES: 'neet_test_scores',
    STATS: 'neet_stats',
    QUESTIONS: 'neet_daily_questions',
    STICKY_NOTES: 'neet_sticky_notes',
    MIGRATED: 'neet_firebase_migrated'
};

export const AppProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [completedTasks, setCompletedTasks] = useState({});
    const [testScores, setTestScores] = useState([]);
    const [dailyQuestions, setDailyQuestions] = useState([]);
    const [stickyNotes, setStickyNotes] = useState([]);
    const [calendarTasks, setCalendarTasks] = useState([]);
    const [stats, setStats] = useState({
        totalXP: 0,
        streakCurrent: 0,
        streakMax: 0,
        lastCompletedDate: null,
    });

    // Timer state - persists across tab switches within the app
    const [timerState, setTimerState] = useState({
        mode: 'work',
        timeLeft: 25 * 60,
        isRunning: false,
        sessionsCompleted: 0,
        selectedWorkDuration: 25,
        selectedBreakDuration: 5,
        startTime: null,
        expectedEndTime: null,
    });

    // Derived stats
    const totalQuestions = dailyQuestions.reduce((sum, entry) => sum + (entry.total || 0), 0);
    const questionStreak = dailyQuestions.length;

    // Migrate data from localStorage to Firebase
    const migrateFromLocalStorage = async () => {
        try {
            console.log('Migrating data from localStorage to Firebase...');

            // Get data from localStorage
            const completed = localStorage.getItem(STORAGE_KEYS.COMPLETED);
            const scores = localStorage.getItem(STORAGE_KEYS.SCORES);
            const questions = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
            const notes = localStorage.getItem(STORAGE_KEYS.STICKY_NOTES);
            const savedStats = localStorage.getItem(STORAGE_KEYS.STATS);

            // Migrate completed tasks
            if (completed) {
                const tasks = JSON.parse(completed);
                for (const [taskId, data] of Object.entries(tasks)) {
                    await firebaseService.saveCompletedTask(taskId);
                }
            }

            // Migrate test scores
            if (scores) {
                const scoresArray = JSON.parse(scores);
                for (const score of scoresArray) {
                    await firebaseService.saveTestScore(score);
                }
            }

            // Migrate stats
            if (savedStats) {
                const statsData = JSON.parse(savedStats);
                await firebaseService.saveStats(statsData);
            }

            // Migrate sticky notes
            if (notes) {
                const notesArray = JSON.parse(notes);
                for (const note of notesArray) {
                    await firebaseService.saveNote(note);
                }
            }

            // Migrate question logs
            if (questions) {
                const questionsArray = JSON.parse(questions);
                for (const log of questionsArray) {
                    await firebaseService.saveQuestionLog(log);
                }
            }

            // Clear localStorage after successful migration
            localStorage.removeItem(STORAGE_KEYS.COMPLETED);
            localStorage.removeItem(STORAGE_KEYS.SCORES);
            localStorage.removeItem(STORAGE_KEYS.STATS);
            localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
            localStorage.removeItem(STORAGE_KEYS.STICKY_NOTES);

            console.log('Migration completed successfully!');
        } catch (error) {
            console.error('Migration error:', error);
        }
    };

    // Load data from Firebase
    const loadFromFirebase = async () => {
        try {
            const [tasks, scores, savedStats, notes, questions, savedTimerState, calTasks] = await Promise.all([
                firebaseService.getCompletedTasks(),
                firebaseService.getTestScores(),
                firebaseService.getStats(),
                firebaseService.getNotes(),
                firebaseService.getQuestionLogs(),
                firebaseService.getTimerState(),
                firebaseService.getCalendarTasks()
            ]);

            setCompletedTasks(tasks);
            setTestScores(scores);
            if (savedStats) setStats(savedStats);
            setStickyNotes(notes);
            setDailyQuestions(questions);
            setCalendarTasks(calTasks);

            // Restore timer state if exists and timer was running
            if (savedTimerState && savedTimerState.expectedEndTime) {
                const now = Date.now();
                const remaining = Math.max(0, Math.floor((savedTimerState.expectedEndTime - now) / 1000));

                if (remaining > 0 && savedTimerState.isRunning) {
                    // Timer is still valid, restore it
                    setTimerState({
                        ...savedTimerState,
                        timeLeft: remaining
                    });
                } else if (remaining <= 0 && savedTimerState.isRunning) {
                    // Timer has ended while away
                    setTimerState({
                        ...savedTimerState,
                        timeLeft: 0,
                        isRunning: false,
                        expectedEndTime: null
                    });
                } else {
                    // Timer was not running, restore state
                    setTimerState(savedTimerState);
                }
            }
        } catch (error) {
            console.error('Error loading from Firebase:', error);
        }
    };

    // Set up real-time listeners
    const setupRealtimeListeners = () => {
        // Listen to completed tasks changes
        const unsubTasks = firebaseService.onCompletedTasksChange((tasks) => {
            setCompletedTasks(tasks);
        });

        // Listen to stats changes
        const unsubStats = firebaseService.onStatsChange((newStats) => {
            setStats(newStats);
        });

        // Listen to notes changes
        const unsubNotes = firebaseService.onNotesChange((notes) => {
            setStickyNotes(notes);
        });

        // Listen to test scores changes
        const unsubScores = firebaseService.onTestScoresChange((scores) => {
            setTestScores(scores);
        });

        // Listen to question logs changes
        const unsubQuestions = firebaseService.onQuestionLogsChange((questions) => {
            setDailyQuestions(questions);
        });

        // Listen to calendar tasks changes
        const unsubCalendarTasks = firebaseService.onCalendarTasksChange((tasks) => {
            setCalendarTasks(tasks);
        });

        return () => {
            unsubTasks();
            unsubStats();
            unsubNotes();
            unsubScores();
            unsubQuestions();
            unsubCalendarTasks();
        };
    };

    // Save timer state to Firebase when it changes (for persistence across reloads/devices)
    const timerSaveTimeoutRef = useRef(null);
    useEffect(() => {
        // Debounce saves to avoid too many writes
        if (timerSaveTimeoutRef.current) {
            clearTimeout(timerSaveTimeoutRef.current);
        }

        timerSaveTimeoutRef.current = setTimeout(() => {
            if (timerState.isRunning || timerState.sessionsCompleted > 0) {
                firebaseService.saveTimerState(timerState);
            }
        }, 500);

        return () => {
            if (timerSaveTimeoutRef.current) {
                clearTimeout(timerSaveTimeoutRef.current);
            }
        };
    }, [timerState]);

    // Timer interval - runs in context so it persists across tab switches
    useEffect(() => {
        let interval = null;

        if (timerState.isRunning && timerState.timeLeft > 0) {
            interval = setInterval(() => {
                setTimerState(prev => {
                    // Calculate remaining time based on expected end time
                    if (prev.expectedEndTime) {
                        const now = Date.now();
                        const remaining = Math.max(0, Math.floor((prev.expectedEndTime - now) / 1000));
                        return { ...prev, timeLeft: remaining };
                    }
                    return { ...prev, timeLeft: prev.timeLeft - 1 };
                });
            }, 1000);
        } else if (timerState.timeLeft === 0 && timerState.isRunning) {
            // Timer completed - stop it
            setTimerState(prev => ({
                ...prev,
                isRunning: false,
                expectedEndTime: null
            }));
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timerState.isRunning, timerState.timeLeft]);

    // Initialize and migrate data
    useEffect(() => {
        const initializeData = async () => {
            try {
                // Check if already migrated
                const hasMigrated = localStorage.getItem(STORAGE_KEYS.MIGRATED);

                if (!hasMigrated) {
                    // Migrate data from localStorage to Firebase
                    await migrateFromLocalStorage();
                    localStorage.setItem(STORAGE_KEYS.MIGRATED, 'true');
                }

                // Load data from Firebase
                await loadFromFirebase();

                // Set up real-time listeners
                const cleanup = setupRealtimeListeners();

                return cleanup;
            } catch (error) {
                console.error('Initialization error:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, []);

    // Toggle task completion
    const toggleTask = async (date, activityType) => {
        const newCompleted = { ...completedTasks };
        const wasCompleted = newCompleted[date];

        if (wasCompleted) {
            delete newCompleted[date];
            await firebaseService.deleteCompletedTask(date);
        } else {
            newCompleted[date] = {
                completedAt: new Date().toISOString(),
                activityType
            };
            await firebaseService.saveCompletedTask(date);
        }

        // Calculate new XP
        const activity = ACTIVITY_TYPES[activityType];
        const xpChange = wasCompleted ? -activity.xp : activity.xp;

        // Update streak
        const today = new Date().toISOString().split('T')[0];
        let newStreak = stats.streakCurrent;
        let newMaxStreak = stats.streakMax;

        if (!wasCompleted && date === today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (stats.lastCompletedDate === yesterdayStr) {
                newStreak = stats.streakCurrent + 1;
            } else if (stats.lastCompletedDate !== today) {
                newStreak = 1;
            }
            newMaxStreak = Math.max(newMaxStreak, newStreak);
        }

        const newStats = {
            ...stats,
            totalXP: Math.max(0, stats.totalXP + xpChange),
            streakCurrent: newStreak,
            streakMax: newMaxStreak,
            lastCompletedDate: !wasCompleted ? date : stats.lastCompletedDate,
        };

        setCompletedTasks(newCompleted);
        setStats(newStats);
        await firebaseService.saveStats(newStats);
    };

    // Add test score
    const addTestScore = async (scoreData) => {
        const newScore = {
            id: Date.now().toString(),
            ...scoreData,
            total: scoreData.physics + scoreData.chemistry + scoreData.biology,
            createdAt: new Date().toISOString(),
        };

        await firebaseService.saveTestScore(newScore);

        // Reload scores from Firebase
        const scores = await firebaseService.getTestScores();
        setTestScores(scores);

        return newScore;
    };

    // Delete test score
    const deleteTestScore = async (scoreId) => {
        try {
            await firebaseService.deleteTestScore(scoreId);
            // Reload scores from Firebase to ensure consistency
            const scores = await firebaseService.getTestScores();
            setTestScores(scores);
        } catch (error) {
            console.error('Error deleting test score:', error);
        }
    };

    // Add daily question entry
    const addDailyQuestions = async (questionData) => {
        const today = new Date().toISOString().split('T')[0];

        const physicsTotal = (questionData.physics?.correct || 0) + (questionData.physics?.wrong || 0);
        const chemistryTotal = (questionData.chemistry?.correct || 0) + (questionData.chemistry?.wrong || 0);
        const botanyTotal = (questionData.botany?.correct || 0) + (questionData.botany?.wrong || 0);
        const zoologyTotal = (questionData.zoology?.correct || 0) + (questionData.zoology?.wrong || 0);

        const totalCorrect = (questionData.physics?.correct || 0) +
            (questionData.chemistry?.correct || 0) +
            (questionData.botany?.correct || 0) +
            (questionData.zoology?.correct || 0);
        const totalWrong = (questionData.physics?.wrong || 0) +
            (questionData.chemistry?.wrong || 0) +
            (questionData.botany?.wrong || 0) +
            (questionData.zoology?.wrong || 0);
        const total = totalCorrect + totalWrong;
        const accuracy = total > 0 ? Math.round((totalCorrect / total) * 100) : 0;

        // Use date as ID so each day has only ONE entry (updates replace existing)
        const newEntry = {
            id: today,
            date: today,
            physics: { correct: questionData.physics?.correct || 0, wrong: questionData.physics?.wrong || 0, total: physicsTotal },
            chemistry: { correct: questionData.chemistry?.correct || 0, wrong: questionData.chemistry?.wrong || 0, total: chemistryTotal },
            botany: { correct: questionData.botany?.correct || 0, wrong: questionData.botany?.wrong || 0, total: botanyTotal },
            zoology: { correct: questionData.zoology?.correct || 0, wrong: questionData.zoology?.wrong || 0, total: zoologyTotal },
            totalCorrect,
            totalWrong,
            total,
            accuracy,
            updatedAt: new Date().toISOString()
        };

        await firebaseService.saveQuestionLog(newEntry);
        // Real-time listener will update the state automatically
    };

    // Sticky Notes CRUD
    const addStickyNote = async (note) => {
        const newNote = {
            id: Date.now().toString(),
            color: '#fff9c4',
            isPinned: false,
            createdAt: new Date().toISOString(),
            ...note
        };
        await firebaseService.saveNote(newNote);
        return newNote;
    };

    const updateStickyNote = async (id, updates) => {
        const note = stickyNotes.find(n => n.id === id);
        if (note) {
            const updatedNote = { ...note, ...updates };
            await firebaseService.saveNote(updatedNote);
        }
    };

    const deleteStickyNote = async (id) => {
        await firebaseService.deleteNote(id);
    };

    const togglePinStickyNote = async (id) => {
        const note = stickyNotes.find(n => n.id === id);
        if (note) {
            await updateStickyNote(id, { isPinned: !note.isPinned });
        }
    };

    // Calendar Tasks CRUD
    const addCalendarTask = async (task) => {
        const newTask = {
            id: `${Date.now()}`,
            title: task.title,
            date: task.date,
            color: task.color || 'blue',
            completed: false,
            createdAt: new Date().toISOString()
        };
        await firebaseService.saveCalendarTask(newTask);
        return newTask;
    };

    const updateCalendarTask = async (id, updates) => {
        const task = calendarTasks.find(t => t.id === id);
        if (task) {
            const updatedTask = { ...task, ...updates, updatedAt: new Date().toISOString() };
            await firebaseService.saveCalendarTask(updatedTask);
        }
    };

    const deleteCalendarTask = async (id) => {
        await firebaseService.deleteCalendarTask(id);
    };

    const toggleCalendarTaskComplete = async (id) => {
        const task = calendarTasks.find(t => t.id === id);
        if (task) {
            await updateCalendarTask(id, { completed: !task.completed });
        }
    };

    // Get current rank based on XP
    const getCurrentRank = () => {
        let currentRank = RANKS[0];
        for (const rank of RANKS) {
            if (stats.totalXP >= rank.minXP) {
                currentRank = rank;
            }
        }
        return currentRank;
    };

    // Get next rank
    const getNextRank = () => {
        const currentRank = getCurrentRank();
        const currentIndex = RANKS.findIndex((r) => r.name === currentRank.name);
        return RANKS[currentIndex + 1] || null;
    };

    // Get XP progress to next rank
    const getXPProgress = () => {
        const currentRank = getCurrentRank();
        const nextRank = getNextRank();

        if (!nextRank) {
            return { current: stats.totalXP, needed: stats.totalXP, percent: 100 };
        }

        const xpInCurrentRank = stats.totalXP - currentRank.minXP;
        const xpNeededForNext = nextRank.minXP - currentRank.minXP;
        const percent = Math.round((xpInCurrentRank / xpNeededForNext) * 100);

        return {
            current: xpInCurrentRank,
            needed: xpNeededForNext,
            percent: Math.min(100, percent),
        };
    };

    // Calculate statistics
    const getStatistics = () => {
        const totalDays = 84;
        const completedCount = Object.keys(completedTasks).length;
        const progressPercent = Math.round((completedCount / totalDays) * 100);

        let mocksCompleted = 0;
        let analysisCompleted = 0;

        Object.values(completedTasks).forEach((task) => {
            if (task.activityType && task.activityType.includes('MOCK')) mocksCompleted++;
            if (task.activityType && task.activityType.includes('TEST')) mocksCompleted++;
            if (task.activityType === 'ANALYSIS') analysisCompleted++;
        });

        const maxScore = testScores.length > 0
            ? Math.max(...testScores.map((s) => s.total))
            : 0;

        return {
            totalCompleted: completedCount,
            progressPercent,
            mocksCompleted,
            analysisCompleted,
            maxScore,
            streakCurrent: stats.streakCurrent,
            streakMax: stats.streakMax,
        };
    };

    // Get unlocked achievements
    const getUnlockedAchievements = () => {
        const statistics = getStatistics();
        return ACHIEVEMENTS.filter((achievement) => achievement.condition(statistics));
    };

    const value = {
        loading,
        completedTasks,
        testScores,
        dailyQuestions,
        totalQuestions,
        questionStreak,
        stats,
        toggleTask,
        addTestScore,
        deleteTestScore,
        addDailyQuestions,
        getCurrentRank,
        getNextRank,
        getXPProgress,
        getStatistics,
        getUnlockedAchievements,
        stickyNotes,
        addStickyNote,
        updateStickyNote,
        deleteStickyNote,
        togglePinStickyNote,
        calendarTasks,
        addCalendarTask,
        updateCalendarTask,
        deleteCalendarTask,
        toggleCalendarTaskComplete,
        timerState,
        setTimerState,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
