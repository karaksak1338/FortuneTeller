import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useFortune } from '../../context/FortuneContext';
import { generateAIFortune } from '../../services/fortuneService';
import './ReadingModal.css';

const ReadingModal = ({ type, onClose }) => {
    const { userData, addFortuneToHistory, t } = useFortune();
    const [step, setStep] = useState('input'); // input, loading, result
    const [question, setQuestion] = useState('');
    const [image, setImage] = useState(null); // Base64 image
    const [result, setResult] = useState('');

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleStartReading = async () => {
        if (type === 'coffee' && !image) return;

        setStep('loading');

        try {
            const fortuneText = await generateAIFortune({
                type,
                input: type === 'question' ? question : '',
                image: type === 'coffee' ? image : null,
                lang: userData.language || 'en',
                persona: 'wise',
                userData
            });

            setResult(fortuneText);
            setStep('result');

            addFortuneToHistory({
                type,
                text: fortuneText,
                date: new Date().toISOString(),
            });
        } catch (err) {
            setResult(t.modal.error);
            setStep('result');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel fade-in">
                <button className="close-button" onClick={onClose}><X size={20} /></button>

                {step === 'input' && (
                    <div className="modal-step">
                        <h2 className="gold-text">{type.toUpperCase()} {t.modal.reading}</h2>
                        {type === 'question' ? (
                            <textarea
                                placeholder={t.modal.placeholder}
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                            />
                        ) : type === 'coffee' ? (
                            <div className="upload-container">
                                <h3 className="upload-title">{t.modal.uploadTitle}</h3>
                                <p className="description">{t.modal.uploadDesc}</p>
                                <div className={`image-preview-zone ${image ? 'has-image' : ''}`}>
                                    {image ? (
                                        <img src={image} alt="Coffee Cup" className="coffee-preview" />
                                    ) : (
                                        <div className="upload-placeholder">
                                            <Sparkles size={32} className="gold-text" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        id="coffee-upload"
                                        className="upload-input"
                                    />
                                    <label htmlFor="coffee-upload" className="upload-label">
                                        {t.modal.uploadBtn}
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <p className="description">{t.modal.desc}</p>
                        )}
                        <button
                            className="mystic-button pulse-glow"
                            onClick={handleStartReading}
                            disabled={type === 'coffee' && !image}
                        >
                            {t.modal.btn}
                        </button>
                    </div>
                )}

                {step === 'loading' && (
                    <div className="modal-step loading-step">
                        <div className="spinner-container">
                            <Sparkles className="spinner float-anim" size={48} />
                        </div>
                        <p className="mystic-glow">{t.modal.loading}</p>
                    </div>
                )}

                {step === 'result' && (
                    <div className="modal-step result-step fade-in">
                        <h2 className="gold-text">{t.modal.resultTitle}</h2>
                        <p className="fortune-result italic">"{result}"</p>
                        <button className="mystic-button" onClick={onClose}>
                            {t.modal.resultBtn}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReadingModal;
