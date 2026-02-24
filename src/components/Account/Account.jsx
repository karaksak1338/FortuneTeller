import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFortune } from '../../context/FortuneContext';
import { User, Shield, CreditCard, Check, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import './Account.css';

const Account = () => {
    const { user, updatePassword, updateProfile } = useAuth();
    const { userData } = useFortune(); // We can also use profile metadata from user object
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const currentPlan = user?.user_metadata?.plan || 'free';

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await updatePassword(newPassword);
            if (error) throw error;
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setNewPassword('');
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handlePlanSwitch = async (plan) => {
        if (plan === currentPlan) return;

        setLoading(true);
        try {
            const { error } = await updateProfile({ plan });
            if (error) throw error;
            setMessage({ type: 'success', text: `Switched to ${plan.toUpperCase()} plan!` });
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="account-container fade-in">
            <header className="account-header">
                <div className="profile-badge">
                    <User size={40} />
                </div>
                <h1>Mystical Profile</h1>
                <p className="user-email">{user?.email}</p>
            </header>

            {message.text && (
                <div className={`account-message ${message.type}`}>
                    {message.type === 'success' ? <Check size={18} /> : <Zap size={18} />}
                    <span>{message.text}</span>
                </div>
            )}

            <div className="account-grid">
                {/* Security Section */}
                <section className="account-section glass-panel">
                    <div className="section-title">
                        <Shield className="gold-text" size={20} />
                        <h2>Security</h2>
                    </div>
                    <p className="section-desc">Update your password directly without a back-and-forth flow.</p>

                    <form onSubmit={handlePasswordUpdate} className="account-form">
                        <div className="input-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="mystic-button" disabled={loading || !newPassword}>
                            {loading ? 'Consulting the stars...' : 'Update Password'}
                        </button>
                    </form>
                </section>

                {/* Plans Section */}
                <section className="account-section glass-panel">
                    <div className="section-title">
                        <CreditCard className="gold-text" size={20} />
                        <h2>Destiny Plans</h2>
                    </div>
                    <p className="section-desc">Choose the level of mystical insight you require.</p>

                    <div className="plans-list">
                        <div className={`plan-card ${currentPlan === 'free' ? 'active' : ''}`}>
                            <div className="plan-header">
                                <h3>Free Plan</h3>
                                <span className="price">$0</span>
                            </div>
                            <ul className="plan-features">
                                <li><Check size={14} /> Basic Fortunes</li>
                                <li><Check size={14} /> Daily Reading</li>
                                <li><Check size={14} /> Local History</li>
                            </ul>
                            <button
                                className="plan-btn"
                                onClick={() => handlePlanSwitch('free')}
                                disabled={currentPlan === 'free' || loading}
                            >
                                {currentPlan === 'free' ? 'Current Plan' : 'Switch to Free'}
                            </button>
                        </div>

                        <div className={`plan-card premium ${currentPlan === 'full' ? 'active' : ''}`}>
                            <div className="plan-header">
                                <h3>Full Plan</h3>
                                <span className="price">Premium</span>
                            </div>
                            <ul className="plan-features">
                                <li><ShieldCheck size={14} /> Unlimited Oracle Access</li>
                                <li><ShieldCheck size={14} /> Persistent Cloud Sync</li>
                                <li><ShieldCheck size={14} /> Multimodal Coffee Reading</li>
                            </ul>
                            <button
                                className="plan-btn premium"
                                onClick={() => handlePlanSwitch('full')}
                                disabled={currentPlan === 'full' || loading}
                            >
                                {currentPlan === 'full' ? 'Current Plan' : 'Unlock Full Access'}
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Account;
