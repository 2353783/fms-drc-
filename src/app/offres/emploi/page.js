'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../../../components/LanguageContext';
import JobCard from '../../../components/JobCard';
import offersData from '../../../data/offers.json';

export default function JobsPage() {
    const { t } = useLanguage();
    const [allJobs, setAllJobs] = useState(offersData.jobs || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [sectorFilter, setSectorFilter] = useState('');

    useEffect(() => {
        const fetchFreshJobs = async () => {
            try {
                const res = await fetch('/api/save-data', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data.jobs)) {
                        setAllJobs(data.jobs);
                    }
                }
            } catch (err) {
                console.error('Error fetching fresh jobs:', err);
            }
        };
        fetchFreshJobs();
    }, []);

    const activeJobs = allJobs.filter(job => job.active);

    const locations = [...new Set(activeJobs.map(job => job.location).filter(Boolean))];
    const sectors = [...new Set(activeJobs.map(job => job.sector).filter(Boolean))];

    const filteredJobs = activeJobs.filter(job => {
        const titleFr = job.title?.fr?.toLowerCase() || '';
        const titleEn = job.title?.en?.toLowerCase() || '';
        const company = job.company?.toLowerCase() || '';
        const term = searchTerm.toLowerCase();

        const matchesSearch = !term || titleFr.includes(term) || titleEn.includes(term) || company.includes(term);
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
