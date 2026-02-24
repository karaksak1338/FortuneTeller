import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Home as HomeIcon, History as HistoryIcon, User, LogOut } from 'lucide-react';
import { useFortune } from './context/FortuneContext';
import { useAuth } from './context/AuthContext';
import Onboarding from './components/Onboarding/Onboarding';
import Home from './components/Home/Home';
import History from './components/History/History';
import Account from './components/Account/Account';
import AuthModal from './components/Auth/AuthModal';
import ResetPassword from './components/Auth/ResetPassword';

const AppContent = () => {
    const { userData, t, updateUserData } = useFortune();
    const { user, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const prevUserRef = React.useRef(null);

    // 1. Mandatory Login Redirect
    useEffect(() => {
        const isActuallyOnboarded = user?.user_metadata?.onboarded || userData.onboarded;

        // If they JUST logged in
        if (!prevUserRef.current && user) {
            if (isActuallyOnboarded) {
                navigate('/home', { replace: true });
            } else {
                navigate('/onboarding', { replace: true });
            }
        }

        prevUserRef.current = user;
    }, [user, navigate, userData.onboarded]);

    // Update LOCAL userData if cloud says we are onboarded
    useEffect(() => {
        if (user?.user_metadata?.onboarded && !userData.onboarded) {
            updateUserData({ onboarded: true });
        }
    }, [user?.user_metadata?.onboarded, userData.onboarded, updateUserData]);

    // 1. Mandatory Login Gate (except for password reset)
    if (!user && location.pathname !== '/reset-password') {
        return (
            <div className="login-gate-container">
                <AuthModal isOpen={true} isGate={true} />
            </div>
        );
    }

    const isActuallyOnboarded = user?.user_metadata?.onboarded || userData.onboarded;
    if (user && !isActuallyOnboarded && location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
    }

    const showHeader = user && isActuallyOnboarded && ['/home', '/history', '/account'].includes(location.pathname);

    return (
        <div className="app-container">
            {showHeader && (
                <header className="main-header glass">
                    <div className="logo-container">
                        <h1 className="gold-text mystic-glow">
                            <Sparkles size={28} className="sparkle-icon" />
                            {t.common?.appName || 'Fortune Teller'}
                        </h1>
                    </div>

                    <div className="header-actions">
                        <select
                            className="lang-select"
                            value={userData.language || 'en'}
                            onChange={(e) => updateUserData({ language: e.target.value })}
                        >
                            <option value="en">EN</option>
                            <option value="tr">TR</option>
                            <option value="de">DE</option>
                        </select>

                        <nav className="main-nav">
                            <Link to="/home" className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}>
                                <HomeIcon size={20} />
                            </Link>
                            <Link to="/history" className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}>
                                <HistoryIcon size={20} />
                            </Link>

                            {user && (
                                <>
                                    <Link to="/account" className={`nav-link ${location.pathname === '/account' ? 'active' : ''}`}>
                                        <User size={20} />
                                    </Link>
                                    <button className="auth-nav-btn logout" onClick={() => signOut()} title="Sign Out">
                                        <LogOut size={20} />
                                    </button>
                                </>
                            )}
                        </nav>
                    </div>
                </header>
            )}

            <main className="main-content">
                <Routes>
                    <Route
                        path="/"
                        element={isActuallyOnboarded ? <Navigate to="/home" /> : <Onboarding />}
                    />
                    <Route
                        path="/onboarding"
                        element={<Onboarding />}
                    />
                    <Route
                        path="/home"
                        element={<Home />}
                    />
                    <Route
                        path="/history"
                        element={<History />}
                    />
                    <Route
                        path="/account"
                        element={<Account />}
                    />
                    <Route
                        path="/reset-password"
                        element={<ResetPassword />}
                    />
                </Routes>
            </main>

            <footer className="main-footer">
                &copy; 2026 {t.common?.appName || 'MysticFortuneTeller'} - {t.footer || 'Developed with Magic'}
            </footer>
        </div>
    );
};

const App = () => (
    <Router>
        <AppContent />
    </Router>
);

export default App;
