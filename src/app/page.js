'use client';

import Link from 'next/link';
import { useLanguage } from '../components/LanguageContext';
import ServiceCard from '../components/ServiceCard';
import JobCard from '../components/JobCard';
import NewsCard from '../components/NewsCard';
import TrainingCard from '../components/TrainingCard';
import offersData from '../data/offers.json';

export default function Home() {
  const { t } = useLanguage();
  const recentJobs = (offersData.jobs || []).filter(job => job.active).slice(0, 3);
  const recentTrainings = (offersData.trainings || []).filter(training => training.active).slice(0, 2);
  const recentNews = (offersData.news || []).filter(news => news.active).slice(0, 2);

  const services = [
    'rh', 'finance', 'tax', 'immigration', 'juridique', 'mines'
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero mesh-bg home-hero" style={{
        padding: '14rem 0 12rem',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url(/images/hero-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        {/* Animated background blobs */}
        <div className="shape-1 floating-shape" style={{ opacity: 0.2, width: '600px', height: '600px', top: '-10%', right: '-10%', background: 'var(--primary-blue)', filter: 'blur(100px)' }}></div>
        <div className="shape-2 floating-shape" style={{ opacity: 0.15, width: '500px', height: '500px', bottom: '-5%', left: '-5%', background: '#3b82f6', filter: 'blur(80px)' }}></div>

        <div className="container relative z-10">
          <div className="hero-content home-hero-content" style={{ maxWidth: '1100px' }}>
            <h1 className="animate-fadeInUp home-hero-title" style={{
              fontSize: '5rem',
              fontWeight: '900',
              lineHeight: '1',
              marginBottom: '2.5rem',
              color: 'white',
              letterSpacing: '-0.04em'
            }}>
              {t('hero.title').split(' ').map((word, i) => i > 1 ? <span key={i} className="gradient-text-light animate-shine">{word} </span> : word + ' ')}
            </h1>
            <p className="animate-fadeInUp animate-delay-1 home-hero-subtitle" style={{
              fontSize: '1.5rem',
              maxWidth: '800px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '4.5rem',
              lineHeight: '1.5',
              fontWeight: '400'
            }}>
              {t('hero.subtitle')}
            </p>

            <div className="hero-buttons animate-fadeInUp animate-delay-2 home-hero-actions" style={{ display: 'flex', gap: '2rem' }}>
              <Link href="/services/rh" className="btn btn-primary" style={{ padding: '1.2rem 3rem', borderRadius: '100px', fontSize: '1rem', fontWeight: '700' }}>
                {t('hero.cta_services')}
              </Link>
              <Link href="/contact" className="btn btn-secondary glass-card" style={{
                padding: '1.2rem 3rem',
                borderRadius: '100px',
                fontSize: '1rem',
                fontWeight: '700',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                {t('hero.cta_contact')}
              </Link>
            </div>
          </div>
        </div>

        {/* Organic Slope Divider */}
        <div className="section-divider divider-bottom slope-divider" style={{ background: 'white', height: '120px' }}></div>
      </section>

      {/* Magazine-style About Section */}
      <section className="about-magazine home-section" style={{ padding: '10rem 0', background: 'white', position: 'relative' }}>
        <div className="container">
          <div className="zigzag-row home-about-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)', gap: '6rem', alignItems: 'center' }}>
            <div className="magazine-image-wrap animate-fadeInLeft">
              <div className="magazine-image-main home-about-image" style={{
                position: 'relative',
                borderRadius: '2.5rem',
                overflow: 'hidden',
                boxShadow: '0 40px 80px rgba(0,0,0,0.15)'
              }}>
                <img
                  src="/images/about-home.jpg"
                  alt="About FMS Executive"
                  style={{ width: '100%', height: '600px', objectFit: 'cover', display: 'block' }}
                />
                <div className="home-about-badge" style={{
                  position: 'absolute',
                  bottom: '2.5rem',
                  right: '2.5rem',
                  padding: '1.5rem 2.5rem',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(15px)',
                  WebkitBackdropFilter: 'blur(15px)',
                  borderRadius: '1.5rem',
                  border: '1px solid rgba(255,255,255,0.4)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  textAlign: 'center'
                }}>
                  <p style={{ color: 'white', fontWeight: '900', fontSize: '2rem', marginBottom: '0.1rem', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>7+</p>
                  <p style={{ fontSize: '0.75rem', color: 'white', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('about.stats.years_label')}</p>
                </div>
              </div>
              {/* Floating decorative element */}

            </div>

            <div className="magazine-content animate-fadeInRight">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <span style={{ width: '40px', height: '2px', background: 'var(--primary-blue)' }}></span>
                <span style={{ color: 'var(--primary-blue)', fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                  {t('sections.about_us')}
                </span>
              </div>
              <h2 className="gradient-text home-section-title" style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '2.5rem' }}>
                {t('about.subtitle')}
              </h2>
              <div style={{ marginBottom: '3rem' }}>
                {t('about.description').split('\n\n').map((para, i) => (
                  <p key={i} style={{
                    fontSize: '1.2rem',
                    color: 'var(--slate-600)',
                    lineHeight: '1.8',
                    textAlign: 'justify',
                    marginBottom: i === t('about.description').split('\n\n').length - 1 ? 0 : '1.5rem'
                  }}>
                    {para}
                  </p>
                ))}
              </div>
              <div>
                <Link href="/a-propos" className="btn btn-primary glow-on-hover" style={{ padding: '1.2rem 3.5rem', borderRadius: '100px', fontWeight: '700' }}>
                  {t('sections.learn_more')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with Soft Curve */}
      <section className="services home-section" style={{
        padding: '10rem 0',
        background: 'var(--slate-50)',
        position: 'relative'
      }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '6rem', textAlign: 'center' }}>
            <h2 className="gradient-text home-section-title" style={{ fontSize: '3rem', fontWeight: '800' }}>{t('sections.our_services')}</h2>
            <p style={{ fontSize: '1.2rem', marginTop: '1rem', textAlign: 'center', margin: '1rem auto 0' }}>{t('sections.services_desc')}</p>
          </div>
          <div className="services-grid">
            {services.slice(0, 6).map(service => (
              <ServiceCard key={service} service={service} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <Link href="/services/rh" className="btn btn-secondary glow-on-hover" style={{ padding: '1.1rem 3rem', borderRadius: '100px', fontWeight: '600' }}>
              {t('hero.cta_services')}
            </Link>
          </div>
        </div>
      </section>

      {/* Job Offers Overlapping Section */}
      <section className="offers home-section" style={{ padding: '10rem 0', background: 'white' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '6rem', textAlign: 'center' }}>
            <h2 className="gradient-text home-section-title" style={{ fontSize: '3rem', fontWeight: '800' }}>{t('sections.latest_jobs')}</h2>
            <p style={{ fontSize: '1.2rem', marginTop: '1rem', textAlign: 'center', margin: '1rem auto 0' }}>{t('sections.jobs_desc')}</p>
          </div>
          <div className="offers-grid">
            {recentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <Link href="/offres/emploi" className="btn btn-secondary" style={{ padding: '1.1rem 3rem', borderRadius: '100px', border: '1px solid var(--gray-lighter)' }}>
              {t('sections.view_details')}
            </Link>
          </div>
        </div>
      </section>

      {/* Elite Trainings Section */}
      <section className="trainings mesh-bg home-section" style={{
        padding: '12rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Organic Slope Divider (Top) */}
        <div className="section-divider divider-top slope-divider-reverse" style={{ background: 'white', height: '100px' }}></div>

        <div className="container relative z-10">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 className="gradient-text-light animate-shine home-section-title" style={{ fontSize: '3.5rem', fontWeight: '800' }}>{t('sections.latest_trainings')}</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', marginTop: '1.5rem', textAlign: 'center', margin: '1.5rem auto 0' }}>{t('sections.trainings_desc')}</p>
          </div>
          <div className="trainings-grid">
            {recentTrainings.map((training) => (
              <TrainingCard key={training.id} training={training} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '6rem' }}>
            <Link href="/offres/formations" className="btn btn-primary pulse" style={{ padding: '1.2rem 4rem', borderRadius: '100px', fontWeight: '800', boxShadow: '0 15px 30px rgba(59, 130, 246, 0.4)' }}>
              {t('sections.view_details')}
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Glass Stats Section */}
      <section className="stats-elite home-stats-section" style={{
        padding: '4rem 0',
        background: '#0f172a',
        position: 'relative',
        marginTop: '-1px'
      }}>
        <div className="container">
          <div className="stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem'
          }}>
            {[
              { val: '2K+', label: t('about.stats.projects_label'), icon: '🚀' },
              { val: '7+', label: t('about.stats.years_label'), icon: '⏳' },
              { val: '15+', label: t('about.stats.clients_label'), icon: '🏆' },
              { val: '1000+', label: t('about.stats.agents_label'), icon: '👥' }
            ].map((stat, i) => (
              <div key={i} className="glass-card-deep animate-fadeInUp home-stat-card" style={{
                padding: '2.5rem',
                borderRadius: '2rem',
                textAlign: 'center',
                animationDelay: `${i * 0.1}s`
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{stat.icon}</div>
                <h3 className="gradient-text-light" style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '0.5rem' }}>{stat.val}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Actualités & Galerie with refined layout */}
      <section className="news home-section" style={{ padding: '10rem 0', background: 'var(--slate-50)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 className="gradient-text home-section-title" style={{ fontSize: '3rem', fontWeight: '800' }}>{t('sections.latest_news')}</h2>
            <p style={{ fontSize: '1.2rem', marginTop: '1rem', textAlign: 'center', margin: '1rem auto 0' }}>{t('sections.news_desc')}</p>
          </div>
          <div className="news-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {recentNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <button className="btn btn-secondary glow-on-hover" style={{ padding: '1rem 3rem', borderRadius: '100px', fontWeight: '600' }}>
              {t('news.more_news')}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
