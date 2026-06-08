'use client';

import Link from 'next/link';
import { useLanguage } from '../../../components/LanguageContext';

export default function RecrutementPage() {
    const { t } = useLanguage();

    return (
        <>
            <section className="page-header" style={{ background: 'linear-gradient(135deg, #f8fafc, rgba(37, 117, 201, 0.1))' }}>
                <div className="container">
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👥</div>
                    <h1>{t('services_list.recruitment')}</h1>
                    <p>{t('services_descriptions.recruitment')}</p>
                </div>
            </section>

            <section style={{ padding: '4rem 0' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Nos Services de Recrutement</h2>
                        <p style={{ marginBottom: '1.5rem', color: '#f8fafc' }}>
                            FMS trouve les meilleurs talents pour votre entreprise grâce à notre expertise en recrutement.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem', borderLeft: '4px solid #2575c9' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>✅ Analyse des Besoins</h4>
                                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Compréhension de vos exigences et culture d'entreprise</p>
                            </div>
                            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem', borderLeft: '4px solid #2575c9' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>✅ Sourcing Candidats</h4>
                                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Recherche active dans notre base de talents</p>
                            </div>
                            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem', borderLeft: '4px solid #2575c9' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>✅ Évaluation</h4>
                                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Tests et entretiens de sélection rigoureux</p>
                            </div>
                            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem', borderLeft: '4px solid #2575c9' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>✅ Intégration</h4>
                                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Accompagnement pour une intégration réussie</p>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <Link href="/contact" className="btn btn-primary">
                                {t('hero.cta_contact')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
