'use client';

import { useLanguage } from '../../components/LanguageContext';

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <div className="relative overflow-hidden" style={{ background: 'var(--bg-white)' }}>
            {/* Background Decorative Shapes */}
            <div className="shape-1 floating-shape" style={{ top: '15%', left: '-5%', opacity: 0.05, width: '500px', height: '500px' }}></div>
            <div className="shape-2 floating-shape" style={{ top: '40%', right: '-10%', opacity: 0.05, width: '600px', height: '600px' }}></div>
            <div className="shape-1 floating-shape" style={{ bottom: '10%', left: '10%', opacity: 0.05, width: '400px', height: '400px', animationDelay: '-3s' }}></div>
            <section className="page-header relative overflow-hidden" style={{
                backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.8)), url(/images/hero-bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '12rem 0 8rem',
                color: 'white',
                textAlign: 'center'
            }}>
                <div className="shape-1 floating-shape"></div>
                <div className="shape-2 floating-shape"></div>

                <div className="container relative z-10">
                    <div className="animate-fadeInUp">
                        <span style={{
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            fontSize: '0.9rem',
                            fontWeight: '700',
                            color: 'var(--primary-blue-light)',
                            marginBottom: '1rem',
                            display: 'block'
                        }}>
                            {t('nav.about')}
                        </span>
                        <h1 className="gradient-text-light" style={{
                            fontSize: '4.5rem',
                            fontWeight: '800',
                            marginBottom: '1.5rem',
                            letterSpacing: '-0.02em',
                            lineHeight: '1.1'
                        }}>
                            {t('about.title')}
                        </h1>
                        <p className="pulse" style={{
                            fontSize: '1.5rem',
                            opacity: 0.9,
                            maxWidth: '700px',
                            margin: '0 auto',
                            fontWeight: '400',
                            lineHeight: '1.6',
                            color: '#e2e8f0',
                            textAlign: 'center'
                        }}>
                            {t('about.subtitle')}
                        </p>
                    </div>
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '100%',
                    height: '100px',
                    background: 'linear-gradient(to top, var(--bg-white), transparent)',
                    zIndex: '5'
                }}></div>
            </section>

            <section style={{ padding: '5rem 0' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            {t('about.description').split('\n\n').map((para, i) => (
                                <p key={i} style={{
                                    fontSize: '1.2rem',
                                    lineHeight: '1.8',
                                    color: 'var(--slate-700)',
                                    marginBottom: i === t('about.description').split('\n\n').length - 1 ? 0 : '1.5rem'
                                }}>
                                    {para}
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="section-zigzag">
                        {/* History Row */}
                        <div className="zigzag-row animate-fadeInUp">
                            <div className="glass-card" style={{ padding: '3rem', borderRadius: '2rem' }}>
                                <h2 className="gradient-text" style={{ marginBottom: '1.5rem', fontSize: '2.5rem' }}>{t('about.history_title')}</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'var(--slate-600)' }}>
                                    {t('about.history_text')}
                                </p>
                            </div>
                            <div style={{ position: 'relative', height: '100%', minHeight: '300px' }}>
                                <div className="shape-1 floating-shape" style={{ opacity: 0.1 }}></div>
                                <div style={{
                                    background: 'url(/images/hero-bg.jpg)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '2rem',
                                    boxShadow: 'var(--shadow-xl)'
                                }}></div>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="zigzag-row animate-fadeInUp animate-delay-2">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                {[
                                    { val: t('about.stats.projects'), label: t('about.stats.projects_label'), icon: '📊' },
                                    { val: t('about.stats.years'), label: t('about.stats.years_label'), icon: '📅' },
                                    { val: t('about.stats.clients'), label: t('about.stats.clients_label'), icon: '🤝' },
                                    { val: t('about.stats.agents'), label: t('about.stats.agents_label'), icon: '👥' }
                                ].map((stat, i) => (
                                    <div key={i} className="glass-card about-stat-card" style={{ padding: '2rem', borderRadius: '1.5rem', textAlign: 'center' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-blue)' }}>{stat.val}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--slate-500)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: '2rem' }}>
                                <h2 className="gradient-text" style={{ marginBottom: '1.5rem', fontSize: '2.5rem' }}>{t('stats.placements').split(' ')[0]} & Plus</h2>
                                <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'var(--slate-600)' }}>
                                    Nos chiffres parlent d'eux-mêmes. Depuis 2018, nous avons bâti une expertise solide et un réseau de confiance qui nous permet de garantir des résultats exceptionnels à nos partenaires.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ margin: '10rem 0' }}>
                        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <h2 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Notre Impact Stratégique</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
                            <div className="glass-card pulse" style={{ padding: '3rem', borderRadius: '2rem', borderTop: '4px solid var(--primary-blue)' }}>
                                <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🚀</div>
                                <h3 style={{ marginBottom: '1rem', color: 'var(--primary-blue)', fontSize: '1.75rem' }}>{t('about.mission_title')}</h3>
                                <p style={{ color: 'var(--slate-600)', lineHeight: '1.7', fontSize: '1.1rem' }}>{t('about.mission_text')}</p>
                            </div>
                            <div className="glass-card" style={{ padding: '3rem', borderRadius: '2rem', borderTop: '4px solid var(--primary-blue-light)' }}>
                                <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>👁️</div>
                                <h3 style={{ marginBottom: '1rem', color: 'var(--primary-blue)', fontSize: '1.75rem' }}>{t('about.vision_title')}</h3>
                                <p style={{ color: 'var(--slate-600)', lineHeight: '1.7', fontSize: '1.1rem' }}>{t('about.vision_text')}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative' }}>
                        <div style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: 'rgba(50, 105, 168, 0.1)', borderRadius: '2rem', color: 'var(--primary-blue)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {t('about.values_title')}
                        </div>
                        <h2 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '4rem' }}>Ce qui nous anime au quotidien</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
                            {[
                                { title: t('about.value1_title'), text: t('about.value1_text'), icon: '👔', color: '#3269a8' },
                                { title: t('about.value2_title'), text: t('about.value2_text'), icon: '⚖️', color: '#5b8ec5' },
                                { title: t('about.value3_title'), text: t('about.value3_text'), icon: '🔒', color: '#0f172a' }
                            ].map((val, i) => (
                                <div key={i} className="glass-card value-card animate-fadeInUp" style={{ padding: '3rem', borderRadius: '2.5rem', textAlign: 'center', borderBottom: `6px solid ${val.color}`, animationDelay: `${0.1 * (i + 4)}s` }}>
                                    <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}>{val.icon}</div>
                                    <h4 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'var(--slate-800)' }}>{val.title}</h4>
                                    <p style={{ color: 'var(--slate-600)', fontSize: '1.05rem', lineHeight: '1.6' }}>{val.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
