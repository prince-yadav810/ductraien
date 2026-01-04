import { useMemo } from 'react';
import { Stethoscope, Clock, Sparkles } from 'lucide-react';
import { NEET_DATE, getDailyQuote } from '../data/scheduleData';
import { useApp } from '../context/AppContext';
import './Header.css';

const Header = () => {
    const { useFirebase, getCurrentRank, stats } = useApp();

    // Calculate days until NEET
    const daysUntilNEET = useMemo(() => {
        const now = new Date();
        const timeDiff = NEET_DATE.getTime() - now.getTime();
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    }, []);

    // Get today's quote
    const quote = useMemo(() => getDailyQuote(), []);

    // Get current rank
    const rank = getCurrentRank();

    // Format current date
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-left">
                    <div className="logo">
                        <Stethoscope size={32} className="logo-icon" />
                        <div className="logo-text">
                            <h1>NEET 2026</h1>
                            <span>Command Center</span>
                        </div>
                    </div>
                </div>

                <div className="header-center">
                    {/* Removed Countdown - redundant */}
                </div>

                <div className="header-right">
                    <div className="header-badge">
                        <span className="rank-icon">{rank.icon}</span>
                        <span className="rank-name">{rank.name}</span>
                        {!useFirebase && <span className="offline-badge">Offline Mode</span>}
                    </div>

                    <div className="calendar-icon">
                        <div className="calendar-month">
                            {new Date().toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="calendar-day">
                            {new Date().getDate()}
                        </div>
                    </div>
                </div>
            </div>

            <div className="quote-banner">
                <Sparkles size={16} className="quote-icon" />
                <p className="quote-text">"{quote.text}"</p>
                <span className="quote-author">— {quote.author}</span>
            </div>
        </header>
    );
};

export default Header;
