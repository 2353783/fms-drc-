'use client';

import { useState } from 'react';
import { useLanguage } from './LanguageContext';

export default function JobCard({ job }) {
    const { t, getLocalizedContent, locale } = useLanguage();
    const [showModal, setShowModal] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [cvName, setCvName] = useState('');
    const [letterName, setLetterName] = useState('');
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

    const handleSendApplication = (e) => {
        e.preventDefault();
        const jobTitle = getLocalizedContent(job.title);
        const subject = encodeURIComponent(`Candidature au poste de ${jobTitle} - ${fullName || 'Candidat'}`);
        let bodyText = `Bonjour l'équipe Recrutement FMS,\n\n`;
        bodyText += `Je vous adresse ma candidature pour l'offre : ${jobTitle}.\n\n`;
        bodyText += `Mes coordonnées :\n`;
        bodyText += `- Nom complet : ${fullName}\n`;
        bodyText += `- Email : ${email}\n`;
        bodyText += `- Téléphone : ${phone}\n\n`;
        if (cvName) bodyText += `- CV joint : ${cvName}\n`;
        if (letterName) bodyText += `- Lettre de motivation jointe : ${letterName}\n`;
        bodyText += `\nVeuillez trouver mes pièces jointes (CV et Lettre de motivation) ci-annexées.\n\nCordialement,\n${fullName}`;

        window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
    };

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(targetEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
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
                        <button onClick={() => setShowModal(true)} className="btn btn-primary glow-on-hover" style={{ width: '100%', padding: '0.85rem', borderRadius: '0.75rem', fontWeight: '700', fontSize: '0.95rem' }}>
                            Postuler maintenant
                        </button>
                    )}
                </div>
            </div>

            {/* Application Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(6px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem'
                }} onClick={() => setShowModal(false)}>
                    <div style={{
                        background: 'white',
                        borderRadius: '1.5rem',
                        maxWidth: '560px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '2.5rem',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                        position: 'relative'
                    }} onClick={e => e.stopPropagation()}>
                        {/* Close button */}
                        <button onClick={() => setShowModal(false)} style={{
                            position: 'absolute',
                            top: '1.25rem',
                            right: '1.25rem',
                            background: 'var(--slate-100)',
                            border: 'none',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            color: 'var(--slate-600)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>✕</button>

                        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>📄</span>
                            <h3 style={{ color: 'var(--slate-900)', fontSize: '1.5rem', fontWeight: '800' }}>
                                Postuler à l'offre
                            </h3>
                            <p style={{ color: 'var(--primary-blue)', fontWeight: '700', fontSize: '1.1rem', marginTop: '0.25rem' }}>
                                {getLocalizedContent(job.title)}
                            </p>
                        </div>

                        {/* Direct Email Banner */}
                        <div style={{
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderRadius: '1rem',
                            padding: '1rem 1.25rem',
                            marginBottom: '1.75rem',
                            fontSize: '0.9rem',
                            color: '#1e40af'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <strong>📧 Adresse d'envoi directe :</strong>
                                <button type="button" onClick={handleCopyEmail} style={{
                                    background: '#1d4ed8',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.3rem 0.75rem',
                                    borderRadius: '100px',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}>
                                    {copied ? '✓ Copié !' : 'Copier l\'email'}
                                </button>
                            </div>
                            <code style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#1e3a8a' }}>{targetEmail}</code>
                            <p style={{ marginTop: '0.5rem', fontSize: '0.825rem', margin: 0, color: '#3b82f6' }}>
                                Veuillez nous transmettre votre <strong>CV</strong> et votre <strong>Lettre de Motivation</strong> en pièces jointes.
                            </p>
                        </div>

                        <form onSubmit={handleSendApplication} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                                    Nom complet *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Jean Dupont"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 1rem',
                                        borderRadius: '0.75rem',
                                        border: '1px solid var(--slate-200)',
                                        fontSize: '0.95rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="votre.email@exemple.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem 1rem',
                                            borderRadius: '0.75rem',
                                            border: '1px solid var(--slate-200)',
                                            fontSize: '0.95rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="+243 ..."
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem 1rem',
                                            borderRadius: '0.75rem',
                                            border: '1px solid var(--slate-200)',
                                            fontSize: '0.95rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* File Upload 1: CV */}
                            <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '0.75rem', border: '1px dashed var(--slate-300)' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                                    📎 Joindre votre CV (PDF, DOCX) *
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    required
                                    onChange={(e) => setCvName(e.target.files[0]?.name || '')}
                                    style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}
                                />
                            </div>

                            {/* File Upload 2: Cover letter */}
                            <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '0.75rem', border: '1px dashed var(--slate-300)' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                                    ✉️ Joindre votre Lettre de Motivation (PDF, DOCX) *
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    required
                                    onChange={(e) => setLetterName(e.target.files[0]?.name || '')}
                                    style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary pulse" style={{
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                fontSize: '1rem',
                                fontWeight: '800',
                                marginTop: '0.5rem',
                                width: '100%',
                                boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)'
                            }}>
                                Transmettre par Email (recrutement@fms-drc.com)
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

