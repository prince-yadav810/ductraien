import { useState, useEffect } from 'react';
import { Target, Calendar, Award } from 'lucide-react';
import './Hero.css';

const MOTIVATIONAL_MESSAGES = [
    "Every question solved is a step closer to AIIMS.",
    "Your dream white coat is waiting. Earn it today.",
    "Consistency is the only magic you need.",
    "Don't stop until you're proud.",
    "Future Doctor Kajal, your patients are waiting.",
];

const Hero = () => {
    const [displayText, setDisplayText] = useState('');
    const [messageIndex, setMessageIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);

    const currentMessage = MOTIVATIONAL_MESSAGES[messageIndex];

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
                            <span className="value">May 4</span>
                            <span className="label">Exam Date</span>
                        </div>
                    </div>
                    <div className="mini-stat">
                        <div className="icon-box green">
                            <Target size={18} />
                        </div>
                        <div className="stat-info">
                            <span className="value">120</span>
                            <span className="label">Days Left</span>
                        </div>
                    </div>
                    <div className="mini-stat">
                        <div className="icon-box purple">
                            <Award size={18} />
                        </div>
                        <div className="stat-info">
                            <span className="value">Aspirant</span>
                            <span className="label">Current Rank</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hero-right">
                {/* Abstract decorative elements - subtle circles */}
                <div className="apple-circle c1"></div>
                <div className="apple-circle c2"></div>
            </div>
        </section>
    );
};

export default Hero;
