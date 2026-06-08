'use client';

import { useState } from 'react';
import { useLanguage } from '../../components/LanguageContext';

export default function ContactPage() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const subject = encodeURIComponent(`${formData.subject} - De: ${formData.name}`);
        const body = encodeURIComponent(
            `Nom: ${formData.name}\n` +
            `Email: ${formData.email}\n` +
            `Téléphone: ${formData.phone || 'Non renseigné'}\n\n` +
            `Message:\n${formData.message}`
        );

        window.location.href = `mailto:contact@fms-drc.com?subject=${subject}&body=${body}`;

        setStatus('success');
        setTimeout(() => setStatus(''), 3000);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    return (
        <>
            <section className="page-header" style={{
                backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url(/images/contact-hero.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '8rem 0',
                color: 'white',
                textAlign: 'center',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
                <div className="container">
                    <h1 style={{ color: 'white', fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>{t('contact.title')}</h1>
                    <p style={{ color: 'white', fontSize: '1.4rem', opacity: 0.95, maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>{t('contact.subtitle')}</p>
                </div>
            </section>

            <section style={{ padding: '3rem 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
                        <div>
                            <h3 style={{ marginBottom: '1.5rem' }}>{t('footer.contact_us')}</h3>
                            <div style={{ marginBottom: '1rem' }}>
                                <p><strong>📍 {t('footer.address')}:</strong></p>
                                <p>Bernadette Masengu, 4, Avenue Citronnier, 2ème étage, Kinshasa / Gombe</p>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <p><strong>📞 {t('footer.phone')}:</strong></p>
                                <p>+243 808 347 782</p>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <p><strong>✉️ {t('footer.email')}:</strong></p>
                                <p>contact@fms-drc.com</p>
                            </div>
                            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f3f4f6', borderRadius: '0.75rem' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>🕒 Horaires</h4>
                                <p>Lun - Ven: 8h00 - 16h00</p>
                                <p>Sam - Dim: Fermé</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {status === 'success' && (
                                <div style={{ padding: '1rem', background: '#d1fae5', color: '#065f46', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                                    {t('contact.success')}
                                </div>
                            )}
                            <div className="form-group">
                                <label>{t('contact.name')}</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('contact.email')}</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('contact.phone')}</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('contact.subject')}</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('contact.message')}</label>
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                {t('contact.send')}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
