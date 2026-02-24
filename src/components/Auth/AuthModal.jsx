import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isForgot, setIsForgot] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const { signIn, signUp, resetPasswordForEmail } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            if (isForgot) {
                const { error: resetError } = await resetPasswordForEmail(email);
                if (resetError) throw resetError;
                setSuccess('Check your mystical email for recovery instructions!');
                return;
            }

            const { error: authError } = isSignUp
                ? await signUp(email, password)
                : await signIn(email, password);

            if (authError) {
                if (authError.message.includes('already registered')) {
                    setError('You already have an account! Did you forget your password?');
                } else {
                    throw authError;
                }
                return;
            }
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSwitchMode = (mode) => {
        setIsSignUp(mode === 'signup');
        setIsForgot(mode === 'forgot');
        setError(null);
        setSuccess(null);
        setEmail('');
        setPassword('');
    };

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal">
                <button className="close-auth" onClick={onClose}>
                    <X size={24} />
                </button>

                <h2>{isForgot ? 'Recover Key' : (isSignUp ? 'Join the Order' : 'Welcome Back')}</h2>
                <p className="auth-subtitle">
                    {isForgot
                        ? 'Enter your email to reset your secret key'
                        : (isSignUp ? 'Create an account to save your destiny' : 'Sign in to access your mystical history')
                    }
                </p>

                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}

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

                    {!isForgot && (
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
                    )}

                    <button className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Consulting the stars...' : (isForgot ? 'Send Email' : (isSignUp ? 'Sign Up' : 'Sign In'))}
                    </button>

                    {!isSignUp && !isForgot && (
                        <button
                            type="button"
                            className="auth-link-btn"
                            onClick={() => setIsForgot(true)}
                        >
                            Forgot password?
                        </button>
                    )}
                </form>

                <div className="auth-switch">
                    {isForgot
                        ? 'Remembered your key?'
                        : (isSignUp ? 'Already a seeker?' : 'New to the order?')
                    }
                    <button onClick={() => {
                        setIsForgot(false);
                        setIsSignUp(isForgot ? false : !isSignUp);
                    }}>
                        {isForgot ? 'Sign In' : (isSignUp ? 'Sign In' : 'Join Now')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
