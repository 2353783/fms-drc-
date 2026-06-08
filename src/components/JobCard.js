'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageContext';

export default function JobCard({ job }) {
    const { t, getLocalizedContent, locale } = useLanguage();

    const isExpired = () => {
        if (!job.expirationDate) return false;
        const expirationDateTime = new Date(`${job.expirationDate}T${job.expirationTime || '23:59'}`);
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

    const handleApply = () => {
        const subject = encodeURIComponent(`Candidature pour : ${getLocalizedContent(job.title)}`);
        const body = encodeURIComponent(`Bonjour,\n\nJe souhaite postuler pour le poste de ${getLocalizedContent(job.title)} chez ${job.company}.\n\nCordialement.`);
        window.location.href = `mailto:recruitment@fms-drc.com?subject=${subject}&body=${body}`;
    };

    return (
        <div className={`offer-card glow-on-hover ${expired ? 'expired' : ''}`} style={expired ? { opacity: 0.7 } : {}}>
            <div
                className="offer-image"
                style={{
                    backgroundImage: job.image ? `url(${job.image})` : (expired ? 'none' : 'linear-gradient(135deg, #3b82f6, #1e40af)'),
                    backgroundColor: job.image ? '#f8fafc' : (expired ? '#9ca3af' : 'transparent'),
                    backgroundSize: job.image ? 'contain' : 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem'
                }}
            >
                {!job.image && (expired ? '⏰' : '💼')}
            </div>
            <div className="offer-content">
                <h3 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>{getLocalizedContent(job.title)}</h3>
                <div className="offer-meta" style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--gray-medium)' }}>
                    <span>🏢 {job.company}</span>
                    <span>📍 {job.location}</span>
                    {job.salary && <span>💰 {job.salary}</span>}
                </div>
                <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.5' }}>{getLocalizedContent(job.description)}</p>

                {job.expirationDate && (
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
                            <span>❌ {t('jobs.expired')}</span>
                        ) : (
                            <span>📅 {t('jobs.expires_on')}: {formatDate(job.expirationDate)} à {job.expirationTime}</span>
                        )}
                    </div>
                )}

                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                    <span className="offer-tag" style={{ background: '#eff6ff', color: '#1d4ed8', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>{job.type}</span>
                    <span className="offer-tag" style={{ background: '#f5f3ff', color: '#6d28d9', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>{job.sector}</span>
                </div>

                {expired ? (
                    <button disabled className="btn" style={{ width: '100%', background: '#d1d5db', color: '#6b7280', cursor: 'not-allowed' }}>
                        {t('jobs.expired')}
                    </button>
                ) : (
                    <button onClick={handleApply} className="btn btn-primary" style={{ width: '100%' }}>
                        {t('jobs.apply') || 'Postuler maintenant'}
                    </button>
                )}
            </div>
        </div>
    );
}
