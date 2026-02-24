import React from 'react';
import { useFortune } from '../../context/FortuneContext';
import { Clock, ChevronRight } from 'lucide-react';
import './History.css';

const History = () => {
    const { history, t } = useFortune();

    return (
        <div className="history-container fade-in">
            <h2 className="gold-text">{t.history.title}</h2>
            <p className="description">{t.history.desc}</p>

            <div className="history-list">
                {history.length === 0 ? (
                    <div className="empty-history glass-panel">
                        <p>{t.history.empty}</p>
                    </div>
                ) : (
                    history.map((item, index) => (
                        <div key={index} className="history-item glass-panel">
                            <div className="item-meta">
                                <span className="item-type">{item.type.toUpperCase()} {t.modal.reading}</span>
                                <span className="item-date">
                                    <Clock size={12} />
                                    {new Date(item.date).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="item-text italic">"{item.text}"</p>
                            <div className="item-footer">
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default History;
