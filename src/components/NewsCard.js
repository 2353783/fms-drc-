'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageContext';

export default function NewsCard({ news }) {
    const { t, getLocalizedContent } = useLanguage();
    const { id, image, title, description } = news;

    const displayTitle = getLocalizedContent(title) || t(`news.sample_${id}_title`);
    const displayText = getLocalizedContent(description) || t(`news.sample_${id}_text`);

    return (
        <Link href={`/actualites/${id}`} className="news-card" style={{
            display: 'block',
            textDecoration: 'none',
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
            textAlign: 'left'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}>
            <div style={{
                height: '400px',
                position: 'relative',
                backgroundColor: 'var(--slate-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}>
                {/* Blurred backdrop to fill gaps elegantly */}
                <div style={{
                    position: 'absolute',
                    inset: '-20px',
                    backgroundImage: `url(${image || '/images/hr.png'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(30px) brightness(0.9)',
                    opacity: 0.4
                }}></div>

                {/* Main image - fully visible */}
                <img
                    src={image || '/images/hr.png'}
                    alt={displayTitle}
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
            <div style={{ padding: '1.5rem' }}>
                <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'var(--primary-blue)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'block',
                    marginBottom: '0.5rem'
                }}>
                    Actualité
                </span>
                <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    marginBottom: '0.75rem',
                    color: 'var(--slate-800)',
                    lineHeight: '1.4'
                }}>
                    {displayTitle}
                </h3>
                <p style={{
                    fontSize: '0.95rem',
                    color: 'var(--slate-600)',
                    lineHeight: '1.6',
                    display: '-webkit-box',
                    WebkitLineClamp: '3',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {displayText}
                </p>
                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-blue)', fontWeight: '700', fontSize: '0.9rem' }}>
                    {t('sections.learn_more')}
                </div>
            </div>
        </Link>
    );
}
