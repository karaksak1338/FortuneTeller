import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Sparkles, Home as HomeIcon, History as HistoryIcon, User, LogOut } from 'lucide-react';
import { useFortune } from './context/FortuneContext';
import { useAuth } from './context/AuthContext';
import Onboarding from './components/Onboarding/Onboarding';
import Home from './components/Home/Home';
import History from './components/History/History';
import AuthModal from './components/Auth/AuthModal';

const AppContent = () => {
    const { userData, t, updateUserData } = useFortune();
    const { user, signOut } = useAuth();
    const location = useLocation();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // If onboarding not completed, redirect to onboarding (except if already there)
    if (!userData.onboarded && location.pathname !== '/onboarding') {
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

                        {user ? (
                            <button className="auth-nav-btn logout" onClick={() => signOut()} title="Sign Out">
                                <LogOut size={20} />
                            </button>
                        ) : (
                            <button className="auth-nav-btn login" onClick={() => setIsAuthModalOpen(true)} title="Sign In">
                                <User size={20} />
                            </button>
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
                </Routes>
            </main>

            <footer className="main-footer">
                &copy; 2026 {t.common?.appName || 'Fortune Teller'} • {t.footer || 'Developed with Magic'}
            </footer>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </div>
    );
};

const App = () => (
    <Router>
        <AppContent />
    </Router>
);

export default App;
