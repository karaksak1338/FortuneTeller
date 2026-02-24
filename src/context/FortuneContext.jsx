import { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../services/translations';

const FortuneContext = createContext();

export const FortuneProvider = ({ children }) => {
    const [userData, setUserData] = useState(() => {
        const saved = localStorage.getItem('fortune_user_data');
        return saved ? JSON.parse(saved) : {
            name: '',
            birthDay: '',
            birthMonth: '',
            birthYear: '',
            risingSign: '',
            language: 'en',
            onboarded: false,
        };
    });

    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('fortune_history');
        return saved ? JSON.parse(saved) : [];
    });

    const [streak, setStreak] = useState(() => {
        const saved = localStorage.getItem('fortune_streak');
        return saved ? JSON.parse(saved) : 0;
    });

    const t = TRANSLATIONS[userData.language] || TRANSLATIONS.en;

    useEffect(() => {
        localStorage.setItem('fortune_user_data', JSON.stringify(userData));
    }, [userData]);

    useEffect(() => {
        localStorage.setItem('fortune_history', JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        localStorage.setItem('fortune_streak', JSON.stringify(streak));
    }, [streak]);

    const updateUserData = (data) => {
        setUserData(prev => ({ ...prev, ...data }));
    };

    const addFortuneToHistory = (fortune) => {
        setHistory(prev => [fortune, ...prev]);
    };

    return (
        <FortuneContext.Provider value={{
            userData,
            updateUserData,
            history,
            addFortuneToHistory,
            streak,
            setStreak,
            t
        }}>
            {children}
        </FortuneContext.Provider>
    );
};

export const useFortune = () => useContext(FortuneContext);
