'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

export default function Header() {
    const { locale, changeLocale, t } = useLanguage();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const languages = [
        { code: 'fr', label: 'FR' },
        { code: 'en', label: 'EN' },
        { code: 'zh', label: '中' },
        { code: 'es', label: 'ES' },
    ];

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <nav className="nav">
                    <Link href="/" className="nav-logo">
                        <Image src="/logo.png" alt="FMS Logo" width={55} height={55} />
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
                            <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-blue)', letterSpacing: '-0.02em' }}>FMS</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--gray-medium)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Financial Managing Support
                            </span>
                        </div>
                    </Link>

                    <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                        <li>
                            <Link href="/">{t('nav.home')}</Link>
                        </li>
                        <li>
                            <Link href="/a-propos">{t('nav.about')}</Link>
                        </li>
                        <li className={`nav-dropdown ${servicesOpen ? 'open' : ''}`}>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setServicesOpen(!servicesOpen);
                                }}
                            >
                                {t('nav.services')} ▾
                            </a>
                            <div className="nav-dropdown-content">
                                <Link href="/services/placement">{t('services_list.placement')}</Link>
                                <Link href="/services/recruitment">{t('services_list.recruitment')}</Link>
                                <Link href="/services/training">{t('services_list.training')}</Link>
                                <Link href="/services/tax">{t('services_list.tax')}</Link>
                                <Link href="/services/accounting">{t('services_list.accounting')}</Link>
                                <Link href="/services/immigration">{t('services_list.immigration')}</Link>
                                <Link href="/services/payroll">{t('services_list.payroll')}</Link>
                                <Link href="/services/performance">{t('services_list.performance')}</Link>
                                <Link href="/services/teambuilding">{t('services_list.teambuilding')}</Link>
                                <Link href="/services/audit">{t('services_list.audit')}</Link>
                            </div>
                        </li>
                        <li>
                            <Link href="/offres/emploi">{t('nav.jobs')}</Link>
                        </li>
                        <li>
                            <Link href="/offres/formations">{t('nav.training')}</Link>
                        </li>
                        <li>
                            <Link href="/contact">{t('nav.contact')}</Link>
                        </li>
                    </ul>

                    <div className="lang-selector">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                className={locale === lang.code ? 'active' : ''}
                                onClick={() => changeLocale(lang.code)}
                            >
                                {lang.label}
                            </button>
                        ))}
                        {/* Discrete admin icon - hidden behind languages */}
                        <Link
                            href="/admin"
                            style={{
                                marginLeft: '0.5rem',
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.75rem',
                                color: '#9ca3af',
                                opacity: 0.5,
                                transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = 1}
                            onMouseLeave={(e) => e.target.style.opacity = 0.5}
                            title="Admin"
                        >
                            ⚙
                        </Link>
                    </div>

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </nav>
            </div>
        </header>
    );
}
