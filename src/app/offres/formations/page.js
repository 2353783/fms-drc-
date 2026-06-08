'use client';

import { useLanguage } from '../../../components/LanguageContext';
import TrainingCard from '../../../components/TrainingCard';
import offersData from '../../../data/offers.json';

export default function TrainingsPage() {
    const { t } = useLanguage();
    const trainings = offersData.trainings.filter(training => training.active);

    return (
        <>
            <section className="page-header" style={{
                backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url(/images/training-hero.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '8rem 0',
                color: 'white',
                textAlign: 'center',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
                <div className="container">
                    <h1 style={{ color: 'white', fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>{t('trainings.title')}</h1>
                    <p style={{ color: 'white', fontSize: '1.4rem', opacity: 0.95, maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>{t('trainings.subtitle')}</p>
                </div>
            </section>

            <section style={{ padding: '3rem 0', background: '#f8fafc' }}>
                <div className="container">
                    <div className="offers-grid">
                        {trainings.map((training) => (
                            <TrainingCard key={training.id} training={training} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
