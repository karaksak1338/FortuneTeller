import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { signIn, signUp } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { error: authError } = isSignUp
                ? await signUp(email, password)
                : await signIn(email, password);

            if (authError) throw authError;
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal">
                <button className="close-auth" onClick={onClose}>
                    <X size={24} />
                </button>

                <h2>{isSignUp ? 'Join the Order' : 'Welcome Back'}</h2>
                <p className="auth-subtitle">
                    {isSignUp
                        ? 'Create an account to save your destiny'
                        : 'Sign in to access your mystical history'}
                </p>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                        <label>Mystical Email</label>
                        <input
                            type="email"
                            placeholder="oracle@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="auth-input-group">
                        <label>Secret Key (Password)</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Consulting the stars...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                    </button>
                </form>

                <div className="auth-switch">
                    {isSignUp ? 'Already a seeker?' : 'New to the order?'}
                    <button onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? 'Sign In' : 'Join Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
Kinder
