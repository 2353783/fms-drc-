'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageContext';

export default function ServiceCard({ service }) {
    const { t } = useLanguage();

    const serviceImages = {
        placement: '/images/placement-hero.jpg',
        recruitment: '/images/recruitment-hero.jpg',
        training: '/images/training-hero.jpg',
        tax: '/images/fiscal-hero.jpg',
        accounting: '/images/accounting-hero.jpg',
        immigration: '/images/immigration-hero.jpg',
        payroll: '/images/payroll-hero.jpg',
        performance: '/images/performance-hero.jpg',
        teambuilding: '/images/teambuilding-hero.jpg',
        audit: '/images/audit-hero.jpg',
    };

    return (
        <div className="service-card glow-on-hover" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{
                height: '200px',
                position: 'relative',
                backgroundImage: `url(${serviceImages[service] || '/images/hr.png'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.6))'
                }}></div>
            </div>
            <div style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary-blue)', fontSize: '1.4rem' }}>
                    {t(`services_list.${service}`)}
                </h3>
                <p style={{ marginBottom: '1.5rem', fontSize: '1rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
                    {t(`services_descriptions.${service}`)}
                </p>
                <Link href={`/services/${service}`} style={{
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    color: 'var(--primary-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {t('sections.learn_more')}
                </Link>
            </div>
        </div>
    );
}
