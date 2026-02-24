import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
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

    // 1. Mandatory Login Gate (except for password reset)
    if (!user && location.pathname !== '/reset-password') {
        return (
            <div className="login-gate-container">
                <AuthModal isOpen={true} isGate={true} />
            </div>
        );
    }

    // 2. Forced Onboarding (only after login)
    const isActuallyOnboarded = user?.user_metadata?.onboarded || userData.onboarded;
    if (user && !isActuallyOnboarded && location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
    }

    return (
        <div className="app-container">
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

            <main className="main-content">
                <Routes>
                    <Route
                        path="/"
                        element={userData.onboarded ? <Navigate to="/home" /> : <Onboarding />}
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
                &copy; 2026 {t.common?.appName || 'MysticFortuneTeller'} • {t.footer || 'Developed with Magic'}
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
