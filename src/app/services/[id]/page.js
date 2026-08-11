'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../../../components/LanguageContext';

export default function ServiceDetailPage() {
    const { id } = useParams();
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
        juridique: '/images/juridique.jpg',
        mines: '/images/mine.jpg',
        rh: '/images/placement-hero.jpg',
        finance: '/images/accounting-hero.jpg',
    };

    // Normalize ID for localization lookup (recrutement vs recruitment)
    const normalizedId = id === 'recrutement' ? 'recruitment' : id;

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <section className="page-header" style={{
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url(${serviceImages[id] || '/images/hr.png'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                padding: '10rem 0 6rem 0',
                textAlign: 'center',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
                <div className="container">
                    <h1 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: '800' }}>
                        {t(`service_details.${normalizedId}.title`)}
                    </h1>
                    <p style={{ color: 'white', fontSize: '1.4rem', opacity: 1, maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        {t(`service_details.${normalizedId}.subtitle`)}
                    </p>
                </div>
            </section>

            <section style={{ padding: '5rem 0' }}>
                <div className="container">
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div style={{ background: 'white', padding: '3rem', borderRadius: '1.5rem', boxShadow: 'var(--shadow-lg)' }}>
                            {(() => {
                                const paragraphs = t(`service_details.${normalizedId}.p1`).split('\n').map((paragraph, index) => (
                                    paragraph.trim() ? <p key={index} style={{ marginBottom: '1rem' }}>{paragraph}</p> : null
                                ));
                                const features = [1, 2, 3, 4, 5]
                                    .map(num => t(`service_details.${normalizedId}.feature${num}`))
                                    .filter(f => f && !f.startsWith('service_details.'));

                                // Appliquer un thème spécifique selon le service
                                let layoutType = 1;
                                if (['placement', 'payroll', 'audit', 'juridique'].includes(normalizedId)) layoutType = 1;
                                else if (['recruitment', 'tax', 'performance', 'mines', 'finance'].includes(normalizedId)) layoutType = 2;
                                else if (['training', 'teambuilding', 'rh'].includes(normalizedId)) layoutType = 3;
                                else layoutType = 4; // accounting, immigration

                                if (layoutType === 1) {
                                    return (
                                        <>
                                            <h2 style={{ marginBottom: '2rem', color: 'var(--primary-blue)', borderBottom: '2px solid var(--slate-100)', paddingBottom: '1rem' }}>
                                                Vue d'ensemble
                                            </h2>
                                            <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--slate-700)', marginBottom: '3rem' }}>
                                                {paragraphs}
                                            </div>
                                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Ce que nous offrons :</h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
                                                {features.map((feature, idx) => (
                                                    <div key={idx} style={{ padding: '1.5rem', background: 'var(--slate-50)', borderRadius: '1rem', borderLeft: '4px solid var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>✅</span>
                                                        <span style={{ fontWeight: '600', color: 'var(--slate-800)' }}>{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    );
                                } else if (layoutType === 2) {
                                    return (
                                        <>
                                            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                                <h2 style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--primary-blue)', borderBottom: '3px dashed var(--slate-200)', paddingBottom: '0.5rem' }}>
                                                    Vue d'ensemble
                                                </h2>
                                                <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--slate-700)', padding: '0 1rem' }}>
                                                    {paragraphs}
                                                </div>
                                            </div>
                                            <div style={{ background: 'var(--slate-50)', padding: '2.5rem', borderRadius: '1.5rem' }}>
                                                <h3 style={{ marginBottom: '2rem', fontSize: '1.4rem', textAlign: 'center', color: 'var(--primary-blue-dark)' }}>Nos Atouts</h3>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                    {features.map((feature, idx) => (
                                                        <div key={idx} style={{ padding: '1.25rem 1.5rem', background: 'white', borderRadius: '0.75rem', boxShadow: '0 2px 5px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                            <div style={{ background: 'var(--primary-blue-light)', color: 'white', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>{idx + 1}</div>
                                                            <span style={{ fontWeight: '600', color: 'var(--slate-700)', fontSize: '1.05rem' }}>{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    );
                                } else if (layoutType === 3) {
                                    const rhImages = [
                                        '/images/placement-hero.jpg',
                                        '/images/training-hero.jpg',
                                        '/images/performance-hero.jpg',
                                        '/images/teambuilding-hero.jpg'
                                    ];
                                    return (
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                                                <div style={{ height: '2px', flex: 1, background: 'var(--slate-200)' }}></div>
                                                <h2 style={{ color: 'var(--primary-blue)', margin: 0 }}>Vue d'ensemble</h2>
                                                <div style={{ height: '2px', flex: 1, background: 'var(--slate-200)' }}></div>
                                            </div>
                                            <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--slate-700)', marginBottom: '3rem' }}>
                                                {paragraphs}
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                                                {features.map((feature, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        style={{ 
                                                            background: 'white', 
                                                            borderRadius: '1.25rem', 
                                                            overflow: 'hidden',
                                                            border: '1px solid var(--slate-100)', 
                                                            boxShadow: '0 10px 20px -3px rgba(0,0,0,0.08)', 
                                                            transition: 'all 0.3s' 
                                                        }} 
                                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.12)'; }} 
                                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px -3px rgba(0,0,0,0.08)'; }}
                                                    >
                                                        <div style={{ 
                                                            height: '160px', 
                                                            backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.2), rgba(15,23,42,0.6)), url(${rhImages[idx % rhImages.length]})`,
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center'
                                                        }}></div>
                                                        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                                                            <h4 style={{ fontWeight: '700', color: 'var(--slate-800)', margin: 0, lineHeight: '1.4', fontSize: '1.1rem' }}>{feature}</h4>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    );
                                } else {
                                    return (
                                        <>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
                                                <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-blue)', fontSize: '2.2rem', textAlign: 'center' }}>
                                                    Vue d'ensemble
                                                </h2>
                                                <div style={{ width: '80px', height: '4px', background: 'linear-gradient(90deg, var(--primary-blue), var(--primary-blue-light))', borderRadius: '2px', marginBottom: '2rem' }}></div>
                                                <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--slate-700)', borderLeft: '4px solid var(--slate-100)', paddingLeft: '1.5rem' }}>
                                                    {paragraphs}
                                                </div>
                                            </div>
                                            <h3 style={{ marginBottom: '2rem', fontSize: '1.4rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.5rem' }}>Notre approche :</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {features.map((feature, idx) => (
                                                    <div key={idx} style={{ padding: '1.25rem', background: idx % 2 === 0 ? 'var(--slate-50)' : 'white', borderRadius: '0.75rem', border: idx % 2 !== 0 ? '1px solid var(--slate-100)' : 'none', display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: idx % 2 !== 0 ? '2rem' : '0', marginRight: idx % 2 === 0 ? '2rem' : '0', transition: 'margin 0.3s' }}>
                                                        <span style={{ color: 'var(--primary-blue)', fontSize: '1.2rem', flexShrink: 0 }}>✦</span>
                                                        <span style={{ fontWeight: '600', color: 'var(--slate-700)' }}>{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    );
                                }
                            })()}

                            <div style={{ marginTop: '4rem', textAlign: 'center', borderTop: '1px solid var(--slate-100)', paddingTop: '3rem' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>Prêt à démarrer ?</h3>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    <Link href="/contact" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
                                        Contactez-nous
                                    </Link>
                                    <Link href="/" className="btn btn-secondary" style={{ padding: '1rem 2.5rem' }}>
                                        Retour à l'accueil
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
