import { Award, Star, Lock, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RANKS, ACHIEVEMENTS } from '../data/scheduleData';
import './Gamification.css';

const Gamification = () => {
    const { stats, getCurrentRank, getNextRank, getXPProgress, getUnlockedAchievements } = useApp();

    const currentRank = getCurrentRank();
    const nextRank = getNextRank();
    const xpProgress = getXPProgress();
    const unlockedAchievements = getUnlockedAchievements();

    return (
        <div className="gamification">
            <div className="gamification-header">
                <h2 className="section-title">Your Progress</h2>
                <p className="section-subtitle">Level up by completing tasks and earning XP!</p>
            </div>

            {/* Rank Card */}
            <div className="rank-card card">
                <div className="current-rank">
                    <span className="rank-icon-large">{currentRank.icon}</span>
                    <div className="rank-info">
                        <span className="rank-title">Current Rank</span>
                        <span className="rank-name-large">{currentRank.name}</span>
                    </div>
                    <div className="xp-display">
                        <span className="xp-amount mono">{stats.totalXP}</span>
                        <span className="xp-label">Total XP</span>
                    </div>
                </div>

                {nextRank && (
                    <div className="rank-progress">
                        <div className="rank-progress-header">
                            <span className="progress-text">
                                <TrendingUp size={14} />
                                Progress to <strong>{nextRank.name}</strong>
                            </span>
                            <span className="progress-xp mono">
                                {xpProgress.current} / {xpProgress.needed} XP
                            </span>
                        </div>
                        <div className="rank-progress-bar">
                            <div
                                className="rank-progress-fill"
                                style={{
                                    width: `${xpProgress.percent}%`,
                                    background: `linear-gradient(90deg, ${currentRank.color}, ${nextRank.color})`
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* All Ranks */}
            <div className="ranks-overview card">
                <h3 className="card-title">Rank Progression</h3>
                <div className="ranks-list">
                    {RANKS.map((rank, index) => {
                        const isUnlocked = stats.totalXP >= rank.minXP;
                        const isCurrent = rank.name === currentRank.name;

                        return (
                            <div
                                key={rank.name}
                                className={`rank-item ${isUnlocked ? 'unlocked' : ''} ${isCurrent ? 'current' : ''}`}
                            >
                                <div className="rank-item-icon" style={{ color: isUnlocked ? rank.color : undefined }}>
                                    {rank.icon}
                                </div>
                                <div className="rank-item-info">
                                    <span className="rank-item-name">{rank.name}</span>
                                    <span className="rank-item-xp mono">{rank.minXP} XP</span>
                                </div>
                                {!isUnlocked && <Lock size={14} className="lock-icon" />}
                                {isCurrent && <span className="current-badge">Current</span>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Achievements */}
            <div className="achievements card">
                <h3 className="card-title">
                    <Award size={18} />
                    Achievements
                    <span className="achievement-count">
                        {unlockedAchievements.length} / {ACHIEVEMENTS.length}
                    </span>
                </h3>

                <div className="achievements-grid">
                    {ACHIEVEMENTS.map((achievement) => {
                        const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);

                        return (
                            <div
                                key={achievement.id}
                                className={`achievement-item ${isUnlocked ? 'unlocked' : ''}`}
                            >
                                <span className="achievement-icon">{achievement.icon}</span>
                                <div className="achievement-info">
                                    <span className="achievement-name">{achievement.name}</span>
                                    <span className="achievement-desc">{achievement.description}</span>
                                </div>
                                {isUnlocked && (
                                    <Star size={16} className="achievement-star" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* XP Breakdown */}
            <div className="xp-breakdown card">
                <h3 className="card-title">XP System</h3>
                <div className="xp-rules">
                    <div className="xp-rule">
                        <span className="rule-activity">Mock Test / Test</span>
                        <span className="rule-xp badge badge-orange">+50 XP</span>
                    </div>
                    <div className="xp-rule">
                        <span className="rule-activity">Analysis</span>
                        <span className="rule-xp badge badge-purple">+30 XP</span>
                    </div>
                    <div className="xp-rule">
                        <span className="rule-activity">Backlog</span>
                        <span className="rule-xp badge badge-red">+20 XP</span>
                    </div>
                    <div className="xp-rule">
                        <span className="rule-activity">Revision</span>
                        <span className="rule-xp badge badge-blue">+10 XP</span>
                    </div>
                    <div className="xp-rule">
                        <span className="rule-activity">Rest Day</span>
                        <span className="rule-xp badge badge-green">+5 XP</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gamification;
