import { useState, useRef, useEffect } from 'react';
import { Plus, X, Pin, Palette, Trash2, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './StickyNotes.css';

const PRESET_COLORS = [
    { id: 'yellow', bg: '#fff9c4', border: '#fbc02d' },
    { id: 'blue', bg: '#e3f2fd', border: '#64b5f6' },
    { id: 'green', bg: '#e8f5e9', border: '#81c784' },
    { id: 'pink', bg: '#fce4ec', border: '#f06292' },
    { id: 'purple', bg: '#f3e5f5', border: '#ba68c8' },
    { id: 'white', bg: '#ffffff', border: '#e0e0e0' },
];

const StickyNotes = () => {
    const { stickyNotes, addStickyNote, updateStickyNote, deleteStickyNote, togglePinStickyNote } = useApp();
    const [isAdding, setIsAdding] = useState(false);
    const [newNoteText, setNewNoteText] = useState('');
    const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
    const textareaRef = useRef(null);

    // Filter and sort notes (Pinned first)
    const sortedNotes = [...stickyNotes].sort((a, b) => {
        if (a.isPinned === b.isPinned) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return a.isPinned ? -1 : 1;
    });

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNoteText.trim()) return;

        await addStickyNote({
            text: newNoteText,
            color: selectedColor.bg,
            borderColor: selectedColor.border
        });

        setNewNoteText('');
        setIsAdding(false);
    };

    const autoResizeTextarea = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    return (
        <div className="sticky-notes-container fade-in">
            {/* Header Actions */}
            <div className="sticky-header">
                <h2>My Notes</h2>
                <button className="add-note-btn" onClick={() => setIsAdding(true)}>
                    <Plus size={18} /> Add New Note
                </button>
            </div>

            {/* Add Note Modal/Overlay */}
            {isAdding && (
                <div className="add-note-overlay" onClick={() => setIsAdding(false)}>
                    <div className="add-note-modal" onClick={e => e.stopPropagation()} style={{ backgroundColor: selectedColor.bg }}>
                        <div className="modal-header">
                            <span className="modal-title">New Sticky Note</span>
                            <button className="close-btn" onClick={() => setIsAdding(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <textarea
                            autoFocus
                            placeholder="Write your thought here..."
                            value={newNoteText}
                            onChange={e => setNewNoteText(e.target.value)}
                            className="note-input"
                            style={{ backgroundColor: 'transparent' }}
                        />

                        <div className="modal-footer">
                            <div className="color-picker">
                                {PRESET_COLORS.map(color => (
                                    <button
                                        key={color.id}
                                        className={`color-dot ${selectedColor.id === color.id ? 'active' : ''}`}
                                        style={{ backgroundColor: color.bg, borderColor: color.border }}
                                        onClick={() => setSelectedColor(color)}
                                    />
                                ))}
                            </div>
                            <button className="save-btn" onClick={handleAddNote} disabled={!newNoteText.trim()}>
                                Save Note
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notes Grid */}
            <div className="notes-grid">
                {sortedNotes.map(note => (
                    <div
                        key={note.id}
                        className={`sticky-note ${note.isPinned ? 'pinned' : ''}`}
                        style={{ backgroundColor: note.color || '#fff9c4' }}
                    >
                        <div className="note-actions">
                            <button
                                className={`action-btn pin-btn ${note.isPinned ? 'active' : ''}`}
                                onClick={() => togglePinStickyNote(note.id)}
                                title={note.isPinned ? "Unpin" : "Pin to top"}
                            >
                                <Pin size={16} className={note.isPinned ? 'fill-current' : ''} />
                            </button>
                            <div className="right-actions">
                                <NoteColorPicker
                                    currentBg={note.color}
                                    onSelect={(color) => updateStickyNote(note.id, { color: color.bg, borderColor: color.border })}
                                />
                                <button
                                    className="action-btn delete-btn"
                                    onClick={() => deleteStickyNote(note.id)}
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <textarea
                            className="note-content"
                            value={note.text}
                            onChange={(e) => updateStickyNote(note.id, { text: e.target.value })}
                            onInput={autoResizeTextarea}
                            spellCheck="false"
                        />

                        <div className="note-footer">
                            {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                ))}

                {sortedNotes.length === 0 && (
                    <div className="empty-state">
                        <p>No sticky notes yet. Click "Add New Note" to create one!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const NoteColorPicker = ({ currentBg, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="color-picker-wrapper" ref={wrapperRef}>
            <button className="action-btn" onClick={() => setIsOpen(!isOpen)} title="Change Color">
                <Palette size={16} />
            </button>
            {isOpen && (
                <div className="mini-color-palette">
                    {PRESET_COLORS.map(color => (
                        <button
                            key={color.id}
                            className="mini-color-dot"
                            style={{ backgroundColor: color.bg, border: `1px solid ${color.border}` }}
                            onClick={() => {
                                onSelect(color);
                                setIsOpen(false);
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default StickyNotes;
