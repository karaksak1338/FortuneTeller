import React, { useState } from 'react';
import { useFortune } from '../../context/FortuneContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, ArrowRight, Languages } from 'lucide-react';
import './Onboarding.css';

const Onboarding = () => {
    const { userData, updateUserData, t } = useFortune();
    const { updateProfile } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        birthDay: '',
        birthMonth: '',
        language: 'en'
    });
    const navigate = useNavigate();

    const handleNext = () => {
        if (step === 4) {
            updateUserData({ ...formData, onboarded: true });
            updateProfile({ onboarded: true });
            navigate('/home');
        } else {
            setStep(step + 1);
        }
    };

    // Note: Step 1 and 2 need to handle local language before we have the global one set firmly
    // But since we have t in context, it will update as we change formData.language if we update context on the fly
    // However, to keep it simple, we use the local formData.language to switch translations in the view
    // Or just rely on the context which we'll update in Step 2.

    const renderStep1 = () => (
        <div className="onboarding-step fade-in">
            <div className="mystic-icon-container float-anim">
                <Moon className="mystic-icon" size={64} />
            </div>
            <h2 className="gold-text mystic-glow">{t.onboarding.step1.title}</h2>
            <p className="description">{t.onboarding.step1.desc}</p>
            <button className="mystic-button pulse-glow" onClick={handleNext}>
                {t.onboarding.step1.btn}
            </button>
        </div>
    );

    const renderStep2 = () => (
        <div className="onboarding-step fade-in">
            <div className="mystic-icon-container">
                <Languages className="mystic-icon highlight" size={48} />
            </div>
            <h2 className="gold-text">{t.onboarding.step2.title}</h2>
            <p className="description">{t.onboarding.step2.desc}</p>

            <div className="language-selector">
                <button
                    className={`lang-btn ${formData.language === 'en' ? 'active' : ''}`}
                    onClick={() => {
                        setFormData({ ...formData, language: 'en' });
                        updateUserData({ language: 'en' });
                    }}
                >
                    {t.common.languages.en}
                </button>
                <button
                    className={`lang-btn ${formData.language === 'tr' ? 'active' : ''}`}
                    onClick={() => {
                        setFormData({ ...formData, language: 'tr' });
                        updateUserData({ language: 'tr' });
                    }}
                >
                    {t.common.languages.tr}
                </button>
                <button
                    className={`lang-btn ${formData.language === 'de' ? 'active' : ''}`}
                    onClick={() => {
                        setFormData({ ...formData, language: 'de' });
                        updateUserData({ language: 'de' });
                    }}
                >
                    {t.common.languages.de}
                </button>
            </div>

            <button className="mystic-button" onClick={handleNext}>
                {t.onboarding.step2.btn} <ArrowRight size={18} />
            </button>
        </div>
    );

    const renderStep3 = () => (
        <div className="onboarding-step fade-in">
            <h2 className="gold-text">{t.onboarding.step3.title}</h2>
            <p className="description">{t.onboarding.step3.desc}</p>

            <div className="form-container">
                <div className="input-group">
                    <label>{t.onboarding.step3.day}</label>
                    <input
                        type="number"
                        placeholder="DD"
                        min="1" max="31"
                        value={formData.birthDay}
                        onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                    />
                </div>
                <div className="input-group">
                    <label>{t.onboarding.step3.month}</label>
                    <input
                        type="number"
                        placeholder="MM"
                        min="1" max="12"
                        value={formData.birthMonth}
                        onChange={(e) => setFormData({ ...formData, birthMonth: e.target.value })}
                    />
                </div>
                <div className="input-group">
                    <label>{t.onboarding.step3.name}</label>
                    <input
                        type="text"
                        placeholder={t.onboarding.step3.name}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
            </div>

            <button
                className="mystic-button"
                onClick={handleNext}
                disabled={!formData.birthDay || !formData.birthMonth}
            >
                {t.onboarding.step3.btn} <ArrowRight size={18} />
            </button>
        </div>
    );

    const renderStep4 = () => (
        <div className="onboarding-step fade-in">
            <div className="mystic-icon-container float-anim">
                <Sun className="mystic-icon highlight" size={64} />
            </div>
            <h2 className="gold-text">{t.onboarding.step4.title}, {formData.name || t.common.defaultName}</h2>
            <p className="description">{t.onboarding.step4.desc}</p>
            <button className="mystic-button pulse-glow" onClick={handleNext}>
                {t.onboarding.step4.btn}
            </button>
        </div>
    );

    return (
        <div className="onboarding-container glass-panel">
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
            </div>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
        </div>
    );
};

export default Onboarding;
