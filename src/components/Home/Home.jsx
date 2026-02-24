import React, { useEffect, useState } from 'react';
import { useFortune } from '../../context/FortuneContext';
import { getDailyFortune } from '../../services/fortuneService';
import ReadingModal from '../ReadingModal/ReadingModal';
import { Coffee, MessageCircle, Heart, Briefcase, DollarSign, Zap, Clock, Bell } from 'lucide-react';
import './Home.css';

const Home = () => {
    const { userData, streak, setStreak, t } = useFortune();
    const [dailyFortune, setDailyFortune] = useState('');
    const [activeReading, setActiveReading] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        setDailyFortune(getDailyFortune(userData.language || 'en'));

        // Simulate Streak Increment on first load of the day
        const lastOpen = localStorage.getItem('last_open_date');
        const today = new Date().toISOString().split('T')[0];
        if (lastOpen !== today) {
            setStreak(prev => prev + 1);
            localStorage.setItem('last_open_date', today);
        }

        // Simulate a "Mystical" Push Notification after 8 seconds
        const timer = setTimeout(() => {
            setNotification({
                title: t.home.notif.title,
                message: t.home.notif.msg.replace('{name}', userData.name || t.common.defaultName)
            });
        }, 8000);

        return () => clearTimeout(timer);
    }, [userData.name, userData.language, setStreak, t.home.notif]);

    const actions = [
        { id: 'coffee', label: t.home.actions.coffee, icon: <Coffee size={24} />, color: '#c9a86a' },
        { id: 'question', label: t.home.actions.question, icon: <MessageCircle size={24} />, color: '#7b4fb6' },
    ];

    const thematic = [
        { id: 'love', icon: <Heart size={20} />, label: t.home.thematic.love },
        { id: 'career', icon: <Briefcase size={20} />, label: t.home.thematic.career },
        { id: 'money', icon: <DollarSign size={20} />, label: t.home.thematic.money },
        { id: 'mood', icon: <Zap size={20} />, label: t.home.thematic.energy },
    ];

    return (
        <div className="home-container fade-in">
            {notification && (
                <div className="mystic-notification glass-panel slide-down">
                    <Bell size={18} className="gold-text" />
                    <div className="notif-content">
                        <strong>{notification.title}</strong>
                        <p>{notification.message}</p>
                    </div>
                </div>
            )}

            <section className="focus-block glass-panel pulse-glow">
                <div className="block-header">
                    <Clock size={16} />
                    <span>{t.home.dailyTitle}</span>
                </div>
                <p className="fortune-text italic">"{dailyFortune}"</p>
                <div className="streak-badge">
                    <Zap size={14} fill="currentColor" />
                    <span>{streak} {t.home.streak}</span>
                </div>
            </section>

            <div className="action-grid">
                {actions.map(action => (
                    <button
                        key={action.id}
                        className="action-card glass-panel"
                        style={{ '--accent': action.color }}
                        onClick={() => setActiveReading(action.id)}
                    >
                        <div className="icon-circle">{action.icon}</div>
                        <span>{action.label}</span>
                    </button>
                ))}
            </div>

            <section className="thematic-section">
                <h3>{t.home.thematic.title}</h3>
                <div className="thematic-grid">
                    {thematic.map(mode => (
                        <button
                            key={mode.id}
                            className="thematic-chip glass-panel"
                            onClick={() => setActiveReading(mode.id)}
                        >
                            {mode.icon}
                            <span>{mode.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            <div className="journey-indicator">
                <p>{t.home.journey.replace('{name}', userData.name || t.common.defaultName)}</p>
            </div>

            {activeReading && (
                <ReadingModal
                    type={activeReading}
                    onClose={() => setActiveReading(null)}
                />
            )}
        </div>
    );
};

export default Home;
