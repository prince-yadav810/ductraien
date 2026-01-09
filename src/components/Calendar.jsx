import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Check, Trash2, MoreVertical, Edit3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Calendar.css';

// Color categories with low opacity
const TASK_COLORS = [
    { id: 'blue', name: 'Study', bg: 'rgba(0, 122, 255, 0.15)', border: '#007aff', text: '#007aff' },
    { id: 'green', name: 'Personal', bg: 'rgba(52, 199, 89, 0.15)', border: '#34c759', text: '#34c759' },
    { id: 'orange', name: 'Exam Prep', bg: 'rgba(255, 149, 0, 0.15)', border: '#ff9500', text: '#ff9500' },
    { id: 'purple', name: 'Revision', bg: 'rgba(175, 82, 222, 0.15)', border: '#af52de', text: '#af52de' },
    { id: 'red', name: 'Important', bg: 'rgba(255, 59, 48, 0.15)', border: '#ff3b30', text: '#ff3b30' },
    { id: 'teal', name: 'Other', bg: 'rgba(90, 200, 250, 0.15)', border: '#5ac8fa', text: '#5ac8fa' },
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Calendar = () => {
    const { calendarTasks, addCalendarTask, updateCalendarTask, deleteCalendarTask, toggleCalendarTaskComplete } = useApp();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [selectedColor, setSelectedColor] = useState(TASK_COLORS[0]);
    const [draggedTask, setDraggedTask] = useState(null);
    const [showDayModal, setShowDayModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editColor, setEditColor] = useState(TASK_COLORS[0]);
    const menuRef = useRef(null);

    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get calendar grid data
    const getCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startOffset = firstDay.getDay();
        const totalDays = lastDay.getDate();

        const days = [];

        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startOffset - 1; i >= 0; i--) {
            const day = prevMonthLastDay - i;
            const date = new Date(year, month - 1, day);
            days.push({
                date,
                dateString: formatDateString(date),
                day,
                isCurrentMonth: false,
                isToday: false
            });
        }

        // Current month days
        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(year, month, day);
            const dateString = formatDateString(date);
            days.push({
                date,
                dateString,
                day,
                isCurrentMonth: true,
                isToday: dateString === todayString
            });
        }

        // Next month days
        const remaining = 42 - days.length;
        for (let day = 1; day <= remaining; day++) {
            const date = new Date(year, month + 1, day);
            days.push({
                date,
                dateString: formatDateString(date),
                day,
                isCurrentMonth: false,
                isToday: false
            });
        }

        return days;
    };

    const formatDateString = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const getTasksForDate = (dateString) => {
        return calendarTasks.filter(task => task.date === dateString);
    };

    const getColorById = (colorId) => {
        return TASK_COLORS.find(c => c.id === colorId) || TASK_COLORS[0];
    };

    // Navigation
    const navigateMonth = (direction) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Task actions
    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || !selectedDate) return;

        await addCalendarTask({
            title: newTaskTitle,
            date: selectedDate,
            color: selectedColor.id
        });

        setNewTaskTitle('');
        setIsAddingTask(false);
        setSelectedColor(TASK_COLORS[0]);
    };

    const handleDayClick = (dateString) => {
        setSelectedDate(dateString);
        setActiveMenuId(null);
        // On mobile, show modal
        if (window.innerWidth <= 768) {
            setShowDayModal(true);
        }
    };

    // Start editing a task
    const startEditTask = (task) => {
        setEditingTask(task);
        setEditTitle(task.title);
        setEditColor(getColorById(task.color));
        setActiveMenuId(null);
    };

    // Save edited task
    const saveEditTask = async () => {
        if (!editTitle.trim() || !editingTask) return;
        await updateCalendarTask(editingTask.id, {
            title: editTitle,
            color: editColor.id
        });
        setEditingTask(null);
        setEditTitle('');
    };

    // Cancel editing
    const cancelEditTask = () => {
        setEditingTask(null);
        setEditTitle('');
    };

    // Drag and drop
    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e, dateString) => {
        e.preventDefault();
        if (draggedTask && draggedTask.date !== dateString) {
            await updateCalendarTask(draggedTask.id, { date: dateString });
        }
        setDraggedTask(null);
    };

    const handleDragEnd = () => {
        setDraggedTask(null);
    };

    // Mini calendar for sidebar
    const getMiniCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startOffset = firstDay.getDay();
        const totalDays = lastDay.getDate();

        const days = [];
        for (let i = 0; i < startOffset; i++) {
            days.push(null);
        }
        for (let day = 1; day <= totalDays; day++) {
            days.push(day);
        }
        return days;
    };

    const calendarDays = getCalendarDays();

    return (
        <div className="calendar-container fade-in">
            {/* Sidebar with mini calendar */}
            <aside className="calendar-sidebar">
                <div className="mini-calendar">
                    <div className="mini-header">
                        <span>{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                    </div>
                    <div className="mini-weekdays">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <span key={i}>{d}</span>
                        ))}
                    </div>
                    <div className="mini-days">
                        {getMiniCalendarDays().map((day, i) => (
                            <button
                                key={i}
                                className={`mini-day ${day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear() ? 'today' : ''}`}
                                onClick={() => day && setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                                disabled={!day}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selected Date Tasks Panel */}
                <div className="selected-date-panel">
                    <div className="panel-header">
                        <h4>
                            {selectedDate
                                ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                : 'Select a date'
                            }
                        </h4>
                        {selectedDate && (
                            <button className="add-btn" onClick={() => setIsAddingTask(true)}>
                                <Plus size={16} />
                            </button>
                        )}
                    </div>

                    {selectedDate ? (
                        <div className="panel-tasks">
                            {getTasksForDate(selectedDate).length === 0 ? (
                                <p className="no-tasks-msg">No tasks</p>
                            ) : (
                                getTasksForDate(selectedDate).map(task => {
                                    const color = getColorById(task.color);
                                    const isEditing = editingTask?.id === task.id;

                                    if (isEditing) {
                                        return (
                                            <div key={task.id} className="task-edit-form">
                                                <input
                                                    type="text"
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    autoFocus
                                                />
                                                <div className="edit-colors">
                                                    {TASK_COLORS.map(c => (
                                                        <button
                                                            key={c.id}
                                                            className={`edit-color-btn ${editColor.id === c.id ? 'active' : ''}`}
                                                            style={{ backgroundColor: c.bg, borderColor: c.border }}
                                                            onClick={() => setEditColor(c)}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="edit-actions">
                                                    <button onClick={cancelEditTask} className="cancel-edit">Cancel</button>
                                                    <button onClick={saveEditTask} className="save-edit">Save</button>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={task.id}
                                            className={`panel-task-item ${task.completed ? 'completed' : ''}`}
                                            style={{ backgroundColor: color.bg }}
                                        >
                                            <button
                                                className="task-check"
                                                onClick={() => toggleCalendarTaskComplete(task.id)}
                                                style={{ borderColor: color.border }}
                                            >
                                                {task.completed && <Check size={12} style={{ color: color.text }} />}
                                            </button>
                                            <span className="task-name" style={{ color: color.text }}>{task.title}</span>

                                            <div className="task-menu-wrapper" ref={activeMenuId === task.id ? menuRef : null}>
                                                <button
                                                    className="menu-trigger"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveMenuId(activeMenuId === task.id ? null : task.id);
                                                    }}
                                                >
                                                    <MoreVertical size={16} />
                                                </button>

                                                {activeMenuId === task.id && (
                                                    <div className="task-menu">
                                                        <button onClick={() => startEditTask(task)}>
                                                            <Edit3 size={14} /> Edit
                                                        </button>
                                                        <button className="delete" onClick={() => {
                                                            deleteCalendarTask(task.id);
                                                            setActiveMenuId(null);
                                                        }}>
                                                            <Trash2 size={14} /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    ) : (
                        <p className="no-tasks-msg">Click a date to view tasks</p>
                    )}
                </div>
            </aside>

            {/* Main calendar */}
            <main className="calendar-main">
                {/* Header */}
                <header className="calendar-header">
                    <div className="calendar-nav">
                        <button className="nav-arrow" onClick={() => navigateMonth(-1)}>
                            <ChevronLeft size={20} />
                        </button>
                        <h2 className="month-title">{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                        <button className="nav-arrow" onClick={() => navigateMonth(1)}>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <div className="header-actions">
                        <button className="today-btn" onClick={goToToday}>Today</button>
                    </div>
                </header>

                {/* Weekday headers */}
                <div className="weekday-header">
                    {DAYS_OF_WEEK.map(day => (
                        <div key={day} className="weekday">{day}</div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="calendar-grid">
                    {calendarDays.map((dayData, index) => {
                        const tasks = getTasksForDate(dayData.dateString);
                        const visibleTasks = tasks.slice(0, 3);
                        const overflowCount = tasks.length - 3;

                        return (
                            <div
                                key={index}
                                className={`calendar-day ${!dayData.isCurrentMonth ? 'other-month' : ''} ${dayData.isToday ? 'today' : ''} ${draggedTask ? 'drop-target' : ''} ${selectedDate === dayData.dateString ? 'selected' : ''}`}
                                onClick={() => handleDayClick(dayData.dateString)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, dayData.dateString)}
                            >
                                <span className={`day-number ${dayData.isToday ? 'today-ring' : ''}`}>
                                    {dayData.day}
                                </span>

                                <div className="day-tasks">
                                    {visibleTasks.map(task => {
                                        const color = getColorById(task.color);
                                        return (
                                            <div
                                                key={task.id}
                                                className={`task-pill ${task.completed ? 'completed' : ''}`}
                                                style={{
                                                    backgroundColor: color.bg,
                                                    borderLeft: `3px solid ${color.border}`
                                                }}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, task)}
                                                onDragEnd={handleDragEnd}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleCalendarTaskComplete(task.id);
                                                }}
                                            >
                                                <span className="task-title" style={{ color: color.text }}>
                                                    {task.title}
                                                </span>
                                            </div>
                                        );
                                    })}
                                    {overflowCount > 0 && (
                                        <div className="task-overflow">
                                            +{overflowCount} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* Add Task Modal */}
            {isAddingTask && selectedDate && (
                <div className="modal-overlay" onClick={() => setIsAddingTask(false)}>
                    <div className="add-task-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add Task</h3>
                            <span className="modal-date">
                                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </span>
                            <button className="close-btn" onClick={() => setIsAddingTask(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddTask}>
                            <input
                                type="text"
                                placeholder="Task title..."
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                autoFocus
                                className="task-input"
                            />

                            <div className="color-selector">
                                <span className="label">Category:</span>
                                <div className="color-options">
                                    {TASK_COLORS.map(color => (
                                        <button
                                            key={color.id}
                                            type="button"
                                            className={`color-option ${selectedColor.id === color.id ? 'active' : ''}`}
                                            style={{
                                                backgroundColor: color.bg,
                                                borderColor: color.border
                                            }}
                                            onClick={() => setSelectedColor(color)}
                                            title={color.name}
                                        >
                                            {selectedColor.id === color.id && <Check size={14} style={{ color: color.text }} />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="submit-btn" disabled={!newTaskTitle.trim()}>
                                <Plus size={18} /> Add Task
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Mobile Day Detail Modal */}
            {showDayModal && selectedDate && (
                <MobileDayModal
                    dateString={selectedDate}
                    tasks={getTasksForDate(selectedDate)}
                    onClose={() => setShowDayModal(false)}
                    onAddTask={addCalendarTask}
                    onToggleComplete={toggleCalendarTaskComplete}
                    onDeleteTask={deleteCalendarTask}
                    getColorById={getColorById}
                    taskColors={TASK_COLORS}
                />
            )}
        </div>
    );
};

// Mobile Day Detail Modal Component
const MobileDayModal = ({ dateString, tasks, onClose, onAddTask, onToggleComplete, onDeleteTask, getColorById, taskColors }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [selectedColor, setSelectedColor] = useState(taskColors[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        await onAddTask({
            title: newTitle,
            date: dateString,
            color: selectedColor.id
        });

        setNewTitle('');
        setIsAdding(false);
    };

    const dateDisplay = new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="mobile-modal-overlay" onClick={onClose}>
            <div className="mobile-day-modal" onClick={e => e.stopPropagation()}>
                <header className="mobile-modal-header">
                    <h3>{dateDisplay}</h3>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                <div className="mobile-tasks-list">
                    {tasks.length === 0 && !isAdding && (
                        <p className="no-tasks">No tasks for this day</p>
                    )}

                    {tasks.map(task => {
                        const color = getColorById(task.color);
                        return (
                            <div
                                key={task.id}
                                className={`mobile-task-item ${task.completed ? 'completed' : ''}`}
                                style={{ backgroundColor: color.bg }}
                            >
                                <button
                                    className="toggle-btn"
                                    onClick={() => onToggleComplete(task.id)}
                                    style={{ borderColor: color.border }}
                                >
                                    {task.completed && <Check size={14} style={{ color: color.text }} />}
                                </button>
                                <span className="task-text" style={{ color: color.text }}>{task.title}</span>
                                <button className="delete-btn" onClick={() => onDeleteTask(task.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        );
                    })}

                    {isAdding && (
                        <form onSubmit={handleSubmit} className="mobile-add-form">
                            <input
                                type="text"
                                placeholder="Task title..."
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                autoFocus
                            />
                            <div className="mobile-color-picker">
                                {taskColors.map(color => (
                                    <button
                                        key={color.id}
                                        type="button"
                                        className={`color-btn ${selectedColor.id === color.id ? 'active' : ''}`}
                                        style={{ backgroundColor: color.bg, borderColor: color.border }}
                                        onClick={() => setSelectedColor(color)}
                                    />
                                ))}
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setIsAdding(false)} className="cancel-btn">Cancel</button>
                                <button type="submit" className="save-btn" disabled={!newTitle.trim()}>Save</button>
                            </div>
                        </form>
                    )}
                </div>

                {!isAdding && (
                    <button className="add-task-fab" onClick={() => setIsAdding(true)}>
                        <Plus size={24} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Calendar;
