'use client';

import { useState } from 'react';
import { useLanguage } from './LanguageContext';

export default function JobCard({ job }) {
    const { t, getLocalizedContent, locale } = useLanguage();
    const [copied, setCopied] = useState(false);

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

    const targetEmail = 'recrutement@fms-drc.com';

    const handleApply = () => {
        const jobTitle = getLocalizedContent(job.title);
        
        let subject = `Candidature : ${jobTitle}`;
        let bodyText = `Bonjour l'équipe Recrutement FMS,\n\n` +
            `Je vous adresse ma candidature pour l'offre d'emploi : ${jobTitle}.\n\n` +
            `Mes coordonnées :\n` +
            `- Nom complet : \n` +
            `- Téléphone : \n\n` +
            `Veuillez trouver ci-joint mon Curriculum Vitae (CV) ainsi que ma lettre de motivation.\n\n` +
            `Cordialement,`;

        if (locale === 'en') {
            subject = `Application: ${jobTitle}`;
            bodyText = `Dear FMS Recruitment Team,\n\n` +
                `I am submitting my application for the position: ${jobTitle}.\n\n` +
                `Contact details:\n` +
                `- Full Name: \n` +
                `- Phone: \n\n` +
                `Please find attached my CV and cover letter.\n\n` +
                `Best regards,`;
        } else if (locale === 'es') {
            subject = `Candidatura: ${jobTitle}`;
            bodyText = `Estimado equipo de Selección FMS,\n\n` +
                `Les presento mi candidatura para el puesto: ${jobTitle}.\n\n` +
                `Datos de contacto:\n` +
                `- Nombre completo: \n` +
                `- Teléfono: \n\n` +
                `Adjunto mi CV y carta de presentación.\n\n` +
                `Atentamente,`;
        } else if (locale === 'zh') {
            subject = `应聘申请: ${jobTitle}`;
            bodyText = `尊敬的FMS招聘团队：\n\n` +
                `我特此申请该职位：${jobTitle}。\n\n` +
                `个人信息：\n` +
                `- 姓名：\n` +
                `- 电话：\n\n` +
                `随信附上我的简历和求职信。\n\n` +
                `此致，`;
        }

        window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    };

    const handleCopyEmail = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(targetEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const applyButtonLabel = locale === 'en' ? 'Apply now' : locale === 'es' ? 'Postular ahora' : locale === 'zh' ? '立即申请' : 'Postuler maintenant';

    return (
        <div className={`offer-card glow-on-hover ${expired ? 'expired' : ''}`} style={{
            background: 'white',
            borderRadius: '1.25rem',
            border: '1px solid var(--slate-100)',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2rem',
            opacity: expired ? 0.7 : 1,
            position: 'relative'
        }}>
            <div>
                {/* Header badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: expired ? '#94a3b8' : 'linear-gradient(135deg, #1e40af, #3b82f6)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 10px rgba(30, 64, 175, 0.2)'
                    }}>
                        💼
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {job.type && <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '0.35rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700' }}>{job.type}</span>}
                        {job.sector && <span style={{ background: '#f5f3ff', color: '#6d28d9', padding: '0.35rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700' }}>{job.sector}</span>}
                    </div>
                </div>

                <h3 style={{ color: 'var(--primary-blue)', fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.75rem', lineHeight: '1.3' }}>
                    {getLocalizedContent(job.title)}
                </h3>

                <div className="offer-meta" style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.9rem', color: 'var(--slate-600)', fontWeight: '500' }}>
                    <span>🏢 {job.company}</span>
                    <span>📍 {job.location}</span>
                    {job.salary && <span>💰 {job.salary}</span>}
                </div>

                <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--slate-600)' }}>
                    {getLocalizedContent(job.description)}
                </p>
            </div>

            <div>
                {job.expirationDate && (
                    <div style={{
                        marginBottom: '1.25rem',
                        padding: '0.6rem 0.85rem',
                        background: expired ? '#fee2e2' : '#f0fdf4',
                        borderRadius: '0.75rem',
                        fontSize: '0.85rem',
                        color: expired ? '#dc2626' : '#166534',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        {expired ? (
                            <span>❌ {t('jobs.expired')}</span>
                        ) : (
                            <span>📅 {t('jobs.expires_on')}: {formatDate(job.expirationDate)} à {job.expirationTime}</span>
                        )}
                    </div>
                )}

                {expired ? (
                    <button disabled className="btn" style={{ width: '100%', background: '#cbd5e1', color: '#64748b', cursor: 'not-allowed', padding: '0.85rem', borderRadius: '0.75rem', fontWeight: '600' }}>
                        {t('jobs.expired')}
                    </button>
                ) : (
                    <>
                        <button
                            onClick={handleApply}
                            className="btn btn-primary glow-on-hover"
                            style={{
                                width: '100%',
                                padding: '0.9rem 1.25rem',
                                borderRadius: '0.75rem',
                                fontWeight: '700',
                                fontSize: '0.95rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span>✉️</span> {applyButtonLabel}
                        </button>
                        
                        <div style={{
                            marginTop: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#f8fafc',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.6rem',
                            border: '1px solid var(--slate-200)',
                            fontSize: '0.78rem',
                            color: 'var(--slate-600)'
                        }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                📧 <strong style={{ color: 'var(--primary-blue)' }}>{targetEmail}</strong>
                            </span>
                            <button
                                type="button"
                                onClick={handleCopyEmail}
                                style={{
                                    background: copied ? '#10b981' : '#eff6ff',
                                    color: copied ? '#ffffff' : '#1d4ed8',
                                    border: '1px solid ' + (copied ? '#10b981' : '#bfdbfe'),
                                    padding: '0.25rem 0.6rem',
                                    borderRadius: '0.4rem',
                                    fontSize: '0.72rem',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    flexShrink: 0,
                                    marginLeft: '0.5rem',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {copied ? '✓ Copié' : 'Copier'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

