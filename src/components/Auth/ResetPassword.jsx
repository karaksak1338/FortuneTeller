import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './ResetPassword.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { updatePassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match the star patterns!');
            return;
        }

        if (password.length < 6) {
            setError('Your secret key must be at least 6 characters long.');
            return;
        }

        setLoading(true);
        try {
            const { error: updateError } = await updatePassword(password);
            if (updateError) throw updateError;
            setSuccess(true);
            setTimeout(() => navigate('/home'), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="reset-container">
                <div className="reset-card glass-panel fade-in">
                    <div className="success-icon slide-down">
                        <Check size={48} />
                    </div>
                    <h2>Destiny Updated!</h2>
                    <p>Your secret key has been reset successfully. Returning you to the home page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-container">
            <div className="reset-card glass-panel fade-in">
                <div className="mystic-header">
                    <Sparkles className="gold-text" size={32} />
                    <h2>Reset Your Secret Key</h2>
                    <p>Enter your new secret key twice to align the stars.</p>
                </div>

                {error && (
                    <div className="reset-error slide-down">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form className="reset-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>New Secret Key</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Confirm Secret Key</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="mystic-button" disabled={loading}>
                        {loading ? 'Aligning Stars...' : 'Update Key'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
