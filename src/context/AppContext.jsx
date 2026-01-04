import { createContext, useContext, useState, useEffect } from 'react';
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
    const [stats, setStats] = useState({
        totalXP: 0,
        streakCurrent: 0,
        streakMax: 0,
        lastCompletedDate: null,
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
            const [tasks, scores, savedStats, notes, questions] = await Promise.all([
                firebaseService.getCompletedTasks(),
                firebaseService.getTestScores(),
                firebaseService.getStats(),
                firebaseService.getNotes(),
                firebaseService.getQuestionLogs()
            ]);

            setCompletedTasks(tasks);
            setTestScores(scores);
            if (savedStats) setStats(savedStats);
            setStickyNotes(notes);
            setDailyQuestions(questions);
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

        return () => {
            unsubTasks();
            unsubStats();
            unsubNotes();
        };
    };

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
        const newScores = testScores.filter((s) => s.id !== scoreId);
        setTestScores(newScores);
        // Note: You'll need to add deleteTestScore to firebaseService if needed
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

        const newEntry = {
            id: `${today}_${Date.now()}`,
            date: today,
            physics: { correct: questionData.physics?.correct || 0, wrong: questionData.physics?.wrong || 0, total: physicsTotal },
            chemistry: { correct: questionData.chemistry?.correct || 0, wrong: questionData.chemistry?.wrong || 0, total: chemistryTotal },
            botany: { correct: questionData.botany?.correct || 0, wrong: questionData.botany?.wrong || 0, total: botanyTotal },
            zoology: { correct: questionData.zoology?.correct || 0, wrong: questionData.zoology?.wrong || 0, total: zoologyTotal },
            totalCorrect,
            totalWrong,
            total,
            accuracy,
            createdAt: new Date().toISOString()
        };

        await firebaseService.saveQuestionLog(newEntry);

        // Reload questions from Firebase
        const questions = await firebaseService.getQuestionLogs();
        setDailyQuestions(questions);
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
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
