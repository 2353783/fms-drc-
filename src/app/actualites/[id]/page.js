'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../../components/LanguageContext';
import offersFallback from '../../../data/offers.json';

export default function ActualiteDetailPage() {
    const { id } = useParams();
    const { t, getLocalizedContent } = useLanguage();
    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);

    const defaultImages = {
        '1': '/images/recruitment.png',
        '2': '/images/training.png',
        '3': '/images/finance.png',
    };

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                const res = await fetch('/api/save-data', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    const list = Array.isArray(data.news) ? data.news : [];
                    const found = list.find(item => String(item.id) === String(id));
                    if (found) {
                        setNewsItem(found);
                    }
                }
            } catch (err) {
                console.error('Erreur chargement actualité:', err);
            } finally {
                setLoading(false);
            }
        };

        // Fallback initial
        const fallbackFound = (offersFallback.news || []).find(item => String(item.id) === String(id));
        if (fallbackFound) {
            setNewsItem(fallbackFound);
        }

        fetchNewsDetail();
    }, [id]);

    const title = newsItem ? (getLocalizedContent(newsItem.title) || t(`news.sample_${id}_title`)) : t(`news.sample_${id}_title`);
    const description = newsItem ? (getLocalizedContent(newsItem.description) || t(`news.sample_${id}_text`)) : t(`news.sample_${id}_text`);
    const image = (newsItem && newsItem.image) ? newsItem.image : (defaultImages[id] || '/images/hr.png');
    const date = (newsItem && newsItem.date) ? newsItem.date : 'Janvier 2026';
    const isPdf = image && image.toLowerCase().endsWith('.pdf');

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingTop: '80px' }}>
            <section style={{ padding: '4rem 0' }}>
                <div className="container">
                    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                        <Link href="/" style={{ color: 'var(--primary-blue)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontWeight: '600' }}>
                            ← Retour à l'accueil
                        </Link>

                        {/* Image ou bannière document */}
                        {isPdf ? (
                            <div style={{
                                padding: '3rem',
                                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                                borderRadius: '1.5rem',
                                marginBottom: '2rem',
                                color: 'white',
                                textAlign: 'center',
                                boxShadow: 'var(--shadow-lg)'
                            }}>
                                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📄</span>
                                <h3 style={{ color: 'white', marginBottom: '1rem' }}>Document officiel attaché</h3>
                                <a
                                    href={image}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                    style={{ padding: '0.75rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    📥 Ouvrir / Télécharger le document PDF
                                </a>
                            </div>
                        ) : (
                            <div style={{
                                height: '420px',
                                backgroundImage: `url(${image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: '1.5rem',
                                marginBottom: '2rem',
                                boxShadow: 'var(--shadow-lg)'
                            }}></div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <span style={{
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                color: 'var(--primary-blue)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                background: 'rgba(30, 58, 138, 0.08)',
                                padding: '0.35rem 0.85rem',
                                borderRadius: '100px'
                            }}>
                                Actualité FMS
                            </span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--slate-500)', fontWeight: '500' }}>
                                📅 {date}
                            </span>
                        </div>

                        <h1 style={{ fontSize: '2.8rem', marginBottom: '1.5rem', lineHeight: '1.2', color: 'var(--slate-900)' }}>
                            {title || 'Actualité FMS'}
                        </h1>

                        {description && (
                            <p style={{ fontSize: '1.25rem', color: 'var(--slate-600)', marginBottom: '2rem', lineHeight: '1.7', fontStyle: 'italic' }}>
                                {description}
                            </p>
                        )}

                        <div style={{
                            fontSize: '1.15rem',
                            lineHeight: '1.9',
                            color: 'var(--slate-800)',
                            background: 'white',
                            padding: '3rem',
                            borderRadius: '1.5rem',
                            boxShadow: 'var(--shadow-md)',
                            border: '1px solid var(--slate-100)'
                        }}>
                            {t(`news.sample_${id}_content`) !== `news.sample_${id}_content`
                                ? t(`news.sample_${id}_content`)
                                : (description || 'Consultez régulièrement cette page pour suivre nos dernières communications et opportunités.')}
                        </div>

                        <div style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <Link href="/contact" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
                                Demander plus d'informations
                            </Link>
                            <Link href="/" className="btn btn-secondary" style={{ padding: '1rem 2rem' }}>
                                Voir toutes les actualités
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
