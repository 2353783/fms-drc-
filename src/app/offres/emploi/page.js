'use client';

import { useState } from 'react';
import { useLanguage } from '../../../components/LanguageContext';
import JobCard from '../../../components/JobCard';
import offersData from '../../../data/offers.json';

export default function JobsPage() {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [sectorFilter, setSectorFilter] = useState('');

    const jobs = offersData.jobs.filter(job => job.active);

    const locations = [...new Set(jobs.map(job => job.location))];
    const sectors = [...new Set(jobs.map(job => job.sector))];

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = !locationFilter || job.location === locationFilter;
        const matchesSector = !sectorFilter || job.sector === sectorFilter;
        return matchesSearch && matchesLocation && matchesSector;
    });

    return (
        <>
            <section className="page-header" style={{
                backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url(/images/jobs-hero.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '8rem 0',
                color: 'white',
                textAlign: 'center',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
                <div className="container">
                    <h1 style={{ color: 'white', fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>{t('jobs.title')}</h1>
                    <p style={{ color: 'white', fontSize: '1.4rem', opacity: 0.95, maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>{t('jobs.subtitle')}</p>
                </div>
            </section>

            <section style={{ padding: '3rem 0' }}>
                <div className="container">
                    <div className="filters">
                        <input
                            type="text"
                            className="filter-input"
                            placeholder={t('jobs.search_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="filter-select"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                        >
                            <option value="">{t('jobs.filter_all')} - {t('jobs.filter_location')}</option>
                            {locations.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                        <select
                            className="filter-select"
                            value={sectorFilter}
                            onChange={(e) => setSectorFilter(e.target.value)}
                        >
                            <option value="">{t('jobs.filter_all')} - {t('jobs.filter_sector')}</option>
                            {sectors.map(sec => (
                                <option key={sec} value={sec}>{sec}</option>
                            ))}
                        </select>
                    </div>

                    {filteredJobs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                            <h3>{t('jobs.no_results')}</h3>
                        </div>
                    ) : (
                        <div className="offers-grid">
                            {filteredJobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
