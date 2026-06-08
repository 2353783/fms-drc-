'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageContext';

export default function TrainingCard({ training }) {
    const { t, getLocalizedContent, locale } = useLanguage();

    const isExpired = () => {
        if (!training.expirationDate) return false;
        const expirationDateTime = new Date(`${training.expirationDate}T${training.expirationTime || '23:59'}`);
        return new Date() > expirationDateTime;
    };

    const expired = isExpired();

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : locale === 'es' ? 'es-ES' : locale === 'en' ? 'en-US' : 'fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleRegister = () => {
        const subject = encodeURIComponent(`Inscription Formation : ${getLocalizedContent(training.title)}`);
        const body = encodeURIComponent(`Bonjour,\n\nJe souhaite m'inscrire à la formation : ${getLocalizedContent(training.title)}.\n\nNom :\nPrénom :\nTéléphone :\n\n---\nContact & WhatsApp : +243 856 519 549 / 808 347 782`);
        window.location.href = `mailto:formation@fms-drc.com?subject=${subject}&body=${body}`;
    };

    return (
        <div className={`offer-card glow-on-hover ${expired ? 'expired' : ''}`} style={expired ? { opacity: 0.7 } : {}}>
            <div style={{
                height: '400px',
                position: 'relative',
                backgroundColor: 'var(--slate-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}>
                {/* Blurred backdrop */}
                <div style={{
                    position: 'absolute',
                    inset: '-20px',
                    backgroundImage: `url(${training.image || '/images/hr.png'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(30px) brightness(0.9)',
                    opacity: 0.4
                }}></div>

                <img
                    src={training.image || '/images/hr.png'}
                    alt={getLocalizedContent(training.title)}
                    style={{
                        position: 'relative',
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        zIndex: 1,
                        boxShadow: '0 15px 35px rgba(0,0,0,0.15)'
                    }}
                />
            </div>
            <div className="offer-content">
                <h3 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>{getLocalizedContent(training.title)}</h3>
                <div className="offer-meta" style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
                    <span>⏱️ {training.duration}</span>
                    <span>💳 {training.price}</span>
                    <span>📊 {getLocalizedContent(training.level)}</span>
                </div>
                <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.5' }}>{getLocalizedContent(training.description)}</p>

                {training.expirationDate && (
                    <div style={{
                        marginBottom: '1.5rem',
                        padding: '0.5rem 0.75rem',
                        background: expired ? '#fee2e2' : '#f0fdf4',
                        borderRadius: '0.5rem',
                        fontSize: '0.85rem',
                        color: expired ? '#dc2626' : '#166534',
                        fontWeight: '600'
                    }}>
                        {expired ? (
                            <span>❌ {t('trainings.expired')}</span>
                        ) : (
                            <span>📅 {t('trainings.expires_on')}: {formatDate(training.expirationDate)} à {training.expirationTime}</span>
                        )}
                    </div>
                )}

                {expired ? (
                    <button disabled className="btn" style={{ width: '100%', background: '#d1d5db', color: '#6b7280', cursor: 'not-allowed' }}>
                        {t('trainings.expired')}
                    </button>
                ) : (
                    <>
                        <button onClick={handleRegister} className="btn btn-primary" style={{ width: '100%' }}>
                            {t('sections.register') || "S'inscrire"}
                        </button>
                        <p style={{
                            marginTop: '1rem',
                            fontSize: '0.75rem',
                            color: 'var(--gray-medium)',
                            textAlign: 'center',
                            lineHeight: '1.4',
                            fontWeight: '500'
                        }}>
                            Contact & WhatsApp : <br />
                            <span style={{ color: 'var(--primary-blue)', fontWeight: '700' }}>+243 856 519 549 / 808 347 782</span>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
