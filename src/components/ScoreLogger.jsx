import { useState } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './ScoreLogger.css';

const ScoreLogger = () => {
    const { testScores, addTestScore, deleteTestScore } = useApp();

    const [formData, setFormData] = useState({
        physics: '',
        chemistry: '',
        biology: '',
        timeTaken: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.physics || !formData.chemistry || !formData.biology) {
            return;
        }

        setIsSubmitting(true);

        await addTestScore({
            physics: parseInt(formData.physics) || 0,
            chemistry: parseInt(formData.chemistry) || 0,
            biology: parseInt(formData.biology) || 0,
            timeTaken: parseInt(formData.timeTaken) || 0,
            date: formData.date,
            notes: formData.notes,
        });

        // Reset form
        setFormData({
            physics: '',
            chemistry: '',
            biology: '',
            timeTaken: '',
            date: new Date().toISOString().split('T')[0],
            notes: '',
        });

        setIsSubmitting(false);
    };

    const total = (parseInt(formData.physics) || 0) +
        (parseInt(formData.chemistry) || 0) +
        (parseInt(formData.biology) || 0);

    return (
        <div className="score-logger">
            <div className="logger-form card">
                <h3 className="form-title">Log Test Score</h3>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Physics (180)</label>
                            <input
                                type="number"
                                name="physics"
                                value={formData.physics}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                                max="180"
                            />
                        </div>

                        <div className="form-group">
                            <label>Chemistry (180)</label>
                            <input
                                type="number"
                                name="chemistry"
                                value={formData.chemistry}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                                max="180"
                            />
                        </div>

                        <div className="form-group">
                            <label>Biology (360)</label>
                            <input
                                type="number"
                                name="biology"
                                value={formData.biology}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                                max="360"
                            />
                        </div>

                        <div className="form-group">
                            <label>Time (minutes)</label>
                            <input
                                type="number"
                                name="timeTaken"
                                value={formData.timeTaken}
                                onChange={handleChange}
                                placeholder="180"
                                min="0"
                                max="200"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Notes (optional)</label>
                        <input
                            type="text"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Any observations..."
                        />
                    </div>

                    <div className="form-total">
                        <span className="total-label">Total Score:</span>
                        <span className={`total-value mono ${total >= 600 ? 'excellent' : total >= 500 ? 'good' : ''}`}>
                            {total} / 720
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary submit-btn"
                        disabled={isSubmitting || !formData.physics || !formData.chemistry || !formData.biology}
                    >
                        <Plus size={18} />
                        Log Score
                    </button>
                </form>
            </div>

            {/* Recent Scores */}
            <div className="recent-scores card">
                <h3 className="form-title">Recent Scores</h3>

                {testScores.length === 0 ? (
                    <p className="no-scores">No test scores logged yet.</p>
                ) : (
                    <div className="scores-list">
                        {[...testScores].reverse().slice(0, 5).map((score) => (
                            <div key={score.id} className="score-item">
                                <div className="score-main">
                                    <span className="score-total mono">{score.total}/720</span>
                                    <span className="score-date">{new Date(score.date).toLocaleDateString()}</span>
                                </div>
                                <div className="score-breakdown">
                                    <span className="subject phy">P: {score.physics}</span>
                                    <span className="subject chem">C: {score.chemistry}</span>
                                    <span className="subject bio">B: {score.biology}</span>
                                    {score.timeTaken > 0 && (
                                        <span className="time">
                                            <Clock size={12} />
                                            {score.timeTaken}m
                                        </span>
                                    )}
                                </div>
                                <button
                                    className="delete-btn"
                                    onClick={() => deleteTestScore(score.id)}
                                    title="Delete score"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScoreLogger;
