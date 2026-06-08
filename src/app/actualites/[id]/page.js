'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../../components/LanguageContext';

export default function ActualiteDetailPage() {
    const { id } = useParams();
    const { t } = useLanguage();

    const newsImages = {
        '1': '/images/recruitment.png',
        '2': '/images/training.png',
        '3': '/images/finance.png',
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingTop: '80px' }}>
            <section style={{ padding: '4rem 0' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <Link href="/" style={{ color: 'var(--primary-blue)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontWeight: '600' }}>
                            ← Retour à l'accueil
                        </Link>

                        <div style={{
                            height: '400px',
                            backgroundImage: `url(${newsImages[id] || '/images/hr.png'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '1.5rem',
                            marginBottom: '2rem',
                            boxShadow: 'var(--shadow-lg)'
                        }}></div>

                        <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '700',
                            color: 'var(--primary-blue)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            display: 'block',
                            marginBottom: '1rem'
                        }}>
                            Actualité • Janvier 2026
                        </span>

                        <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                            {t(`news.sample_${id}_title`)}
                        </h1>

                        <p style={{ fontSize: '1.3rem', color: 'var(--slate-600)', marginBottom: '2.5rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                            {t(`news.sample_${id}_text`)}
                        </p>

                        <div style={{
                            fontSize: '1.15rem',
                            lineHeight: '1.9',
                            color: 'var(--slate-800)',
                            background: 'white',
                            padding: '3rem',
                            borderRadius: '1.5rem',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            {t(`news.sample_${id}_content`)}
                        </div>

                        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                            <Link href="/contact" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
                                Demander plus d'informations
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
