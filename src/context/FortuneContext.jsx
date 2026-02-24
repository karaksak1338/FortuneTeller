import { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../services/translations';
import { supabase } from '../services/supabase';
import { useAuth } from './AuthContext';

const FortuneContext = createContext();

export const FortuneProvider = ({ children }) => {
    const { user } = useAuth();
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

    // Load history from Supabase on login
    useEffect(() => {
        const fetchSupabaseHistory = async () => {
            if (user) {
                // Clear state first to avoid showing previous user's data
                setHistory([]);

                const { data, error } = await supabase
                    .from('fortunes')
                    .select('*')
                    .order('date', { ascending: false });

                if (data && !error) {
                    setHistory(data);
                }
            } else {
                // When logged out, show the anonymous local history
                const saved = localStorage.getItem('fortune_history');
                setHistory(saved ? JSON.parse(saved) : []);
            }
        };

        fetchSupabaseHistory();
    }, [user]);

    useEffect(() => {
        localStorage.setItem('fortune_user_data', JSON.stringify(userData));
    }, [userData]);

    useEffect(() => {
        // Only save to local storage if user is anonymous (to avoid mixing accounts)
        if (!user) {
            localStorage.setItem('fortune_history', JSON.stringify(history));
        }
    }, [history, user]);

    useEffect(() => {
        localStorage.setItem('fortune_streak', JSON.stringify(streak));
    }, [streak]);

    const updateUserData = (data) => {
        setUserData(prev => ({ ...prev, ...data }));
    };

    const addFortuneToHistory = async (fortune) => {
        // 1. Update Local State
        setHistory(prev => [fortune, ...prev]);

        // 2. Sync to Supabase if authenticated
        if (user) {
            try {
                const { error } = await supabase
                    .from('fortunes')
                    .insert([
                        {
                            user_id: user.id,
                            type: fortune.type,
                            text: fortune.text,
                            date: new Date(fortune.date).toISOString()
                        }
                    ]);

                if (error) throw error;
            } catch (err) {
                console.error("Failed to sync fortune to Supabase:", err.message);
            }
        }
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
