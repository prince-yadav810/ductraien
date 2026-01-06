import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    onSnapshot,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

const USER_ID = 'default-user'; // Since no auth, use a default ID

// Collection references
const getCollectionRef = (collectionName) => collection(db, collectionName);
const getDocRef = (collectionName, docId) => doc(db, collectionName, docId);

// ===== Completed Tasks =====
export const saveCompletedTask = async (taskId) => {
    try {
        await setDoc(doc(db, 'completedTasks', `${USER_ID}_${taskId}`), {
            taskId,
            userId: USER_ID,
            completedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error saving completed task:', error);
        throw error;
    }
};

export const getCompletedTasks = async () => {
    try {
        const snapshot = await getDocs(collection(db, 'completedTasks'));
        const tasks = {};
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === USER_ID) {
                tasks[data.taskId] = data.completedAt;
            }
        });
        return tasks;
    } catch (error) {
        console.error('Error getting completed tasks:', error);
        return {};
    }
};

export const deleteCompletedTask = async (taskId) => {
    try {
        await deleteDoc(doc(db, 'completedTasks', `${USER_ID}_${taskId}`));
    } catch (error) {
        console.error('Error deleting completed task:', error);
        throw error;
    }
};

// ===== Test Scores =====
export const saveTestScore = async (score) => {
    try {
        const scoreId = `${USER_ID}_${Date.now()}`;
        await setDoc(doc(db, 'testScores', scoreId), {
            ...score,
            userId: USER_ID,
            id: scoreId
        });
        return scoreId;
    } catch (error) {
        console.error('Error saving test score:', error);
        throw error;
    }
};

export const getTestScores = async () => {
    try {
        const q = query(collection(db, 'testScores'), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        const scores = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === USER_ID) {
                scores.push(data);
            }
        });
        return scores;
    } catch (error) {
        console.error('Error getting test scores:', error);
        return [];
    }
};

export const deleteTestScore = async (scoreId) => {
    try {
        await deleteDoc(doc(db, 'testScores', scoreId));
    } catch (error) {
        console.error('Error deleting test score:', error);
        throw error;
    }
};

// ===== Gamification Stats =====
export const saveStats = async (stats) => {
    try {
        await setDoc(doc(db, 'stats', USER_ID), {
            ...stats,
            userId: USER_ID,
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error saving stats:', error);
        throw error;
    }
};

export const getStats = async () => {
    try {
        const docSnap = await getDoc(doc(db, 'stats', USER_ID));
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting stats:', error);
        return null;
    }
};

// ===== Timer State (for persistence across reloads/devices) =====
export const saveTimerState = async (timerState) => {
    try {
        await setDoc(doc(db, 'timerState', USER_ID), {
            ...timerState,
            userId: USER_ID,
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error saving timer state:', error);
        throw error;
    }
};

export const getTimerState = async () => {
    try {
        const docSnap = await getDoc(doc(db, 'timerState', USER_ID));
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting timer state:', error);
        return null;
    }
};

export const onTimerStateChange = (callback) => {
    return onSnapshot(doc(db, 'timerState', USER_ID), (docSnap) => {
        if (docSnap.exists()) {
            callback(docSnap.data());
        }
    });
};

// ===== Sticky Notes =====
export const saveNote = async (note) => {
    try {
        await setDoc(doc(db, 'notes', note.id), {
            ...note,
            userId: USER_ID
        });
    } catch (error) {
        console.error('Error saving note:', error);
        throw error;
    }
};

export const getNotes = async () => {
    try {
        const snapshot = await getDocs(collection(db, 'notes'));
        const notes = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === USER_ID) {
                notes.push(data);
            }
        });
        return notes;
    } catch (error) {
        console.error('Error getting notes:', error);
        return [];
    }
};

export const deleteNote = async (noteId) => {
    try {
        await deleteDoc(doc(db, 'notes', noteId));
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
};

// ===== Question Tracker =====
export const saveQuestionLog = async (log) => {
    try {
        const logId = log.id || `${USER_ID}_${Date.now()}`;
        await setDoc(doc(db, 'questionLogs', logId), {
            ...log,
            id: logId,
            userId: USER_ID
        });
        return logId;
    } catch (error) {
        console.error('Error saving question log:', error);
        throw error;
    }
};

export const getQuestionLogs = async () => {
    try {
        const snapshot = await getDocs(collection(db, 'questionLogs'));
        const logs = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === USER_ID) {
                logs.push(data);
            }
        });
        return logs;
    } catch (error) {
        console.error('Error getting question logs:', error);
        return [];
    }
};

// ===== Focus Sessions =====
export const saveFocusSession = async (session) => {
    try {
        const sessionId = `${USER_ID}_${Date.now()}`;
        await setDoc(doc(db, 'focusSessions', sessionId), {
            ...session,
            id: sessionId,
            userId: USER_ID,
            createdAt: new Date().toISOString()
        });
        return sessionId;
    } catch (error) {
        console.error('Error saving focus session:', error);
        throw error;
    }
};

export const getFocusSessions = async () => {
    try {
        const snapshot = await getDocs(collection(db, 'focusSessions'));
        const sessions = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === USER_ID) {
                sessions.push(data);
            }
        });
        return sessions;
    } catch (error) {
        console.error('Error getting focus sessions:', error);
        return [];
    }
};

export const onFocusSessionsChange = (callback) => {
    const q = collection(db, 'focusSessions');
    return onSnapshot(q, (snapshot) => {
        const sessions = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === USER_ID) {
                sessions.push(data);
            }
        });
        callback(sessions);
    });
};

// ===== Real-time Listeners =====
export const onCompletedTasksChange = (callback) => {
    const q = collection(db, 'completedTasks');
    return onSnapshot(q, (snapshot) => {
        const tasks = {};
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === USER_ID) {
                tasks[data.taskId] = data.completedAt;
            }
        });
        callback(tasks);
    });
};

export const onStatsChange = (callback) => {
    return onSnapshot(doc(db, 'stats', USER_ID), (doc) => {
        if (doc.exists()) {
            callback(doc.data());
        }
    });
};

export const onTestScoresChange = (callback) => {
    const q = query(collection(db, 'testScores'), orderBy('date', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const scores = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === USER_ID) {
                scores.push(data);
            }
        });
        callback(scores);
    });
};

export const onNotesChange = (callback) => {
    const q = collection(db, 'notes');
    return onSnapshot(q, (snapshot) => {
        const notes = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === USER_ID) {
                notes.push(data);
            }
        });
        callback(notes);
    });
};

export const onQuestionLogsChange = (callback) => {
    const q = collection(db, 'questionLogs');
    return onSnapshot(q, (snapshot) => {
        const logs = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === USER_ID) {
                logs.push(data);
            }
        });
        callback(logs);
    });
};
