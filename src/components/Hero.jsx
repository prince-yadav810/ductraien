import { useState, useEffect } from 'react';
import { Target, Calendar, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Hero.css';

const MOTIVATIONAL_MESSAGES = [
    "Every question solved is a step closer to AIIMS.",
    "Your dream white coat is waiting. Earn it today.",
    "Consistency is the only magic you need.",
    "Don't stop until you're proud.",
    "Future Doctor Kajal, your patients are waiting.",
];

// NEET 2026 Exam Date - Update this when official date is announced
const EXAM_DATE = new Date('2026-06-15T00:00:00');

const Hero = () => {
    const { getCurrentRank } = useApp();
    const [displayText, setDisplayText] = useState('');
    const [messageIndex, setMessageIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const [daysLeft, setDaysLeft] = useState(0);

    const currentMessage = MOTIVATIONAL_MESSAGES[messageIndex];
    const currentRank = getCurrentRank();

    // Calculate days left until exam
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateDaysLeft = () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const diffTime = EXAM_DATE.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysLeft(Math.max(0, diffDays));
        };

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = EXAM_DATE.getTime() - now;

            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateDaysLeft();
        updateCountdown();

        const timer = setInterval(updateCountdown, 1000);
        
        // Update at midnight
        const now = new Date();
        const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
        const timeout = setTimeout(calculateDaysLeft, msUntilMidnight);
        
        return () => {
            clearInterval(timer);
            clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        let timeout;
        if (isTyping) {
            if (displayText.length < currentMessage.length) {
                timeout = setTimeout(() => {
                    setDisplayText(currentMessage.slice(0, displayText.length + 1));
                }, 40);
            } else {
                timeout = setTimeout(() => setIsTyping(false), 3000);
            }
        } else {
            if (displayText.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayText(displayText.slice(0, -1));
                }, 20);
            } else {
                setMessageIndex((prev) => (prev + 1) % MOTIVATIONAL_MESSAGES.length);
                setIsTyping(true);
            }
        }
        return () => clearTimeout(timeout);
    }, [displayText, isTyping, currentMessage]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Format exam date
    const examDateFormatted = EXAM_DATE.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return (
        <section className="hero-apple">
            <div className="hero-left">
                <div className="greeting-pill">
                    <span className="dot"></span>
                    {getGreeting()}
                </div>
                <h1 className="hero-title">
                    Hello, Kajal
                </h1>
                <div className="hero-message-container">
                    <p className="hero-message">
                        {displayText}
                        <span className="cursor">|</span>
                    </p>
                </div>

                <div className="hero-stats-row">
                    <div className="mini-stat">
                        <div className="icon-box blue">
                            <Calendar size={18} />
                        </div>
                        <div className="stat-info">
                            <span className="value">{examDateFormatted}</span>
                            <span className="label">Exam Date</span>
                        </div>
                    </div>
                    <div className="mini-stat">
                        <div className="icon-box green">
                            <Target size={18} />
                        </div>
                        <div className="stat-info">
                            <span className="value">{daysLeft}</span>
                            <span className="label">Days Left</span>
                        </div>
                    </div>
                    <div className="mini-stat">
                        <div className="icon-box purple">
                            <Award size={18} />
                        </div>
                        <div className="stat-info">
                            <span className="value">{currentRank?.name || 'Aspirant'}</span>
                            <span className="label">Current Rank</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hero-right">
                <div className="hero-countdown-container">
                    <div className="hero-countdown-content">
                        <div className="hero-countdown-timer">
                            <div className="hero-countdown-group">
                                <div className="hero-countdown-block">
                                    <span className="hero-countdown-number">{String(timeLeft.days).padStart(2, '0')}</span>
                                </div>
                                <span className="hero-countdown-label">Days</span>
                            </div>
                            <div className="hero-countdown-colon">:</div>
                            <div className="hero-countdown-group">
                                <div className="hero-countdown-block">
                                    <span className="hero-countdown-number">{String(timeLeft.hours).padStart(2, '0')}</span>
                                </div>
                                <span className="hero-countdown-label">Hours</span>
                            </div>
                            <div className="hero-countdown-colon">:</div>
                            <div className="hero-countdown-group">
                                <div className="hero-countdown-block">
                                    <span className="hero-countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                </div>
                                <span className="hero-countdown-label">Minutes</span>
                            </div>
                            <div className="hero-countdown-colon">:</div>
                            <div className="hero-countdown-group">
                                <div className="hero-countdown-block">
                                    <span className="hero-countdown-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                </div>
                                <span className="hero-countdown-label">Seconds</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
