import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Sparkles, Home as HomeIcon, History as HistoryIcon } from 'lucide-react';
import { FortuneProvider, useFortune } from './context/FortuneContext';
import Onboarding from './components/Onboarding/Onboarding';
import Home from './components/Home/Home';
import History from './components/History/History';

const App = () => {
    const { userData, t, updateUserData } = useFortune();

    return (
        <Router>
            <div className="app-container">
                <header className="main-header">
                    <h1 className="gold-text mystic-glow">
                        <Sparkles size={28} className="sparkle-icon" />
                        {t.appName}
                    </h1>
                    {userData.onboarded && (
                        <div className="header-actions">
                            <select
                                className="lang-switcher-select"
                                value={userData.language}
                                onChange={(e) => updateUserData({ language: e.target.value })}
                            >
                                <option value="en">{t.common.languages.en}</option>
                                <option value="tr">{t.common.languages.tr}</option>
                                <option value="de">{t.common.languages.de}</option>
                            </select>
                            <nav className="main-nav">
                                <Link to="/home" className="nav-link"><HomeIcon size={20} /> {t.nav.home}</Link>
                                <Link to="/history" className="nav-link"><HistoryIcon size={20} /> {t.nav.history}</Link>
                            </nav>
                        </div>
                    )}
                </header>

                <main className="main-content">
                    <Routes>
                        <Route
                            path="/"
                            element={userData.onboarded ? <Navigate to="/home" /> : <Onboarding />}
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
                    &copy; 2026 {t.appName} • {t.footer}
                </footer>
            </div>
        </Router >
    );
};

export default App;
