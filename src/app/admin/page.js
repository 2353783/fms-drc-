'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../components/LanguageContext';
import offersData from '../../data/offers.json';

const ADMIN_PASSWORD = 'FMS2353783';

export default function AdminPage() {
    const { t, getLocalizedContent } = useLanguage();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('jobs');

    // State for all content types
    const [jobs, setJobs] = useState(offersData.jobs || []);
    const [trainings, setTrainings] = useState(offersData.trainings || []);
    const [news, setNews] = useState(offersData.news || []);
    const [isSaving, setIsSaving] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    // Fetch freshest data from server API
    const loadFreshData = useCallback(async () => {
        try {
            const res = await fetch('/api/save-data', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data.jobs)) setJobs(data.jobs);
                if (Array.isArray(data.trainings)) setTrainings(data.trainings);
                if (Array.isArray(data.news)) setNews(data.news);
            }
        } catch (err) {
            console.error('Failed to load fresh data from server:', err);
        }
    }, []);

    useEffect(() => {
        loadFreshData();
    }, [loadFreshData]);

    const showFeedback = (type, message) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback({ type: '', message: '' }), 3500);
    };

    const persistData = async (updatedJobs, updatedTrainings, updatedNews) => {
        setIsSaving(true);
        try {
            const payload = {
                jobs: updatedJobs !== undefined ? updatedJobs : jobs,
                trainings: updatedTrainings !== undefined ? updatedTrainings : trainings,
                news: updatedNews !== undefined ? updatedNews : news
            };

            const res = await fetch('/api/save-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();
            if (result.success) {
                showFeedback('success', 'Modifications enregistrées sur le serveur avec succès');
                // Ensure state matches saved data
                if (result.data) {
                    if (Array.isArray(result.data.jobs)) setJobs(result.data.jobs);
                    if (Array.isArray(result.data.trainings)) setTrainings(result.data.trainings);
                    if (Array.isArray(result.data.news)) setNews(result.data.news);
                }
            } else {
                showFeedback('error', result.message || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Persistence error:', error);
            showFeedback('error', 'Erreur réseau lors de la sauvegarde sur le serveur');
        } finally {
            setIsSaving(false);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({});

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setError('');
            loadFreshData();
        } else {
            setError('Mot de passe incorrect');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPassword('');
    };

    if (!isAuthenticated) {
        return (
            <>
                <section className="page-header">
                    <div className="container">
                        <h1>🔐 Administration</h1>
                        <p>Accès réservé aux administrateurs FMS</p>
                    </div>
                </section>
                <section style={{ padding: '3rem 0' }}>
                    <div className="container">
                        <div style={{ maxWidth: '420px', margin: '0 auto', background: 'white', padding: '2.5rem', borderRadius: '1.25rem', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid var(--slate-100)' }}>
                            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--slate-800)' }}>Connexion Admin</h3>
                            <form onSubmit={handleLogin}>
                                {error && (
                                    <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#991b1b', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                        ⚠️ {error}
                                    </div>
                                )}
                                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Mot de passe</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Entrez le mot de passe"
                                        required
                                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--slate-300)' }}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', fontWeight: '700' }}>
                                    Se connecter
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    const openAddModal = () => {
        setEditItem(null);
        const baseData = {
            title: { fr: '', en: '', zh: '', es: '' },
            description: { fr: '', en: '', zh: '', es: '' },
            active: true
        };

        if (activeTab === 'jobs') {
            // Note: Jobs do not require image or salary
            setFormData({
                ...baseData,
                company: '',
                location: 'Kinshasa',
                type: 'CDI',
                sector: '',
                publishDate: new Date().toISOString().split('T')[0],
                expirationDate: '',
                expirationTime: '23:59'
            });
        } else if (activeTab === 'trainings') {
            setFormData({
                ...baseData,
                image: '',
                duration: '',
                price: '',
                level: { fr: '', en: '', zh: '', es: '' },
                publishDate: new Date().toISOString().split('T')[0],
                expirationDate: '',
                expirationTime: '23:59'
            });
        } else {
            setFormData({
                ...baseData,
                image: '',
                date: new Date().toISOString().split('T')[0]
            });
        }
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditItem(item);
        setFormData({
            ...item,
            expirationTime: item.expirationTime || '23:59'
        });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        let updatedJobs = [...jobs];
        let updatedTrainings = [...trainings];
        let updatedNews = [...news];

        if (activeTab === 'jobs') {
            // Clean job data: ensure no image or salary
            const { image, salary, ...cleanFormData } = formData;
            if (editItem) {
                updatedJobs = jobs.map(j => j.id === editItem.id ? { ...cleanFormData, id: editItem.id } : j);
            } else {
                const newId = (jobs.length > 0 ? Math.max(...jobs.map(j => j.id || 0)) : 0) + 1;
                updatedJobs = [...jobs, { ...cleanFormData, id: newId }];
            }
            setJobs(updatedJobs);
        } else if (activeTab === 'trainings') {
            if (editItem) {
                updatedTrainings = trainings.map(t => t.id === editItem.id ? { ...formData, id: editItem.id } : t);
            } else {
                const newId = (trainings.length > 0 ? Math.max(...trainings.map(t => t.id || 0)) : 0) + 1;
                updatedTrainings = [...trainings, { ...formData, id: newId }];
            }
            setTrainings(updatedTrainings);
        } else {
            if (editItem) {
                updatedNews = news.map(n => n.id === editItem.id ? { ...formData, id: editItem.id } : n);
            } else {
                const newId = (news.length > 0 ? Math.max(...news.map(n => n.id || 0)) : 0) + 1;
                updatedNews = [...news, { ...formData, id: newId }];
            }
            setNews(updatedNews);
        }

        persistData(updatedJobs, updatedTrainings, updatedNews);
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        const itemToDelete = (activeTab === 'jobs' ? jobs : activeTab === 'trainings' ? trainings : news).find(x => x.id === id);
        const itemTitle = itemToDelete ? getLocalizedContent(itemToDelete.title) : 'cet élément';

        if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement "${itemTitle}" ?`)) {
            let updatedJobs = [...jobs];
            let updatedTrainings = [...trainings];
            let updatedNews = [...news];

            if (activeTab === 'jobs') {
                updatedJobs = jobs.filter(j => j.id !== id);
                setJobs(updatedJobs);
            } else if (activeTab === 'trainings') {
                updatedTrainings = trainings.filter(t => t.id !== id);
                setTrainings(updatedTrainings);
            } else {
                updatedNews = news.filter(n => n.id !== id);
                setNews(updatedNews);
            }

            persistData(updatedJobs, updatedTrainings, updatedNews);
        }
    };

    const toggleStatus = (id) => {
        let updatedJobs = [...jobs];
        let updatedTrainings = [...trainings];
        let updatedNews = [...news];

        if (activeTab === 'jobs') {
            updatedJobs = jobs.map(j => j.id === id ? { ...j, active: !j.active } : j);
            setJobs(updatedJobs);
        } else if (activeTab === 'trainings') {
            updatedTrainings = trainings.map(t => t.id === id ? { ...t, active: !t.active } : t);
            setTrainings(updatedTrainings);
        } else {
            updatedNews = news.map(n => n.id === id ? { ...n, active: !n.active } : n);
            setNews(updatedNews);
        }

        persistData(updatedJobs, updatedTrainings, updatedNews);
    };

    const currentList = activeTab === 'jobs' ? jobs : activeTab === 'trainings' ? trainings : news;

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
            <section className="page-header" style={{ marginBottom: '0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>🔐 {t('admin.title')}</h1>
                        <p>{t('admin.dashboard')}</p>
                    </div>
                    <button onClick={handleLogout} className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', padding: '0.5rem 1.25rem', borderRadius: '0.5rem' }}>
                        Déconnexion
                    </button>
                </div>
            </section>

            <section className="admin-container" style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
                {/* Feedback notification */}
                {feedback.message && (
                    <div style={{
                        padding: '1rem 1.5rem',
                        marginBottom: '1.5rem',
                        borderRadius: '0.75rem',
                        background: feedback.type === 'success' ? '#d1fae5' : '#fee2e2',
                        color: feedback.type === 'success' ? '#065f46' : '#991b1b',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                        <span>{feedback.type === 'success' ? '✅' : '❌'}</span>
                        <span>{feedback.message}</span>
                    </div>
                )}

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', background: 'white', padding: '0.5rem', borderRadius: '1rem', width: 'fit-content', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <button className={`btn ${activeTab === 'jobs' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('jobs')}>
                        💼 Offres d'emploi ({jobs.length})
                    </button>
                    <button className={`btn ${activeTab === 'trainings' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('trainings')}>
                        📚 Formations ({trainings.length})
                    </button>
                    <button className={`btn ${activeTab === 'news' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('news')}>
                        📰 Actualités ({news.length})
                    </button>
                </div>

                {/* Section Header */}
                <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--slate-800)', margin: 0 }}>
                            {activeTab === 'jobs' ? "Gérer les Offres d'emploi" : activeTab === 'trainings' ? 'Gérer les Formations' : 'Gérer les Actualités'}
                        </h2>
                        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--slate-500)', fontSize: '0.9rem' }}>
                            {activeTab === 'jobs' ? "Les offres d'emploi ne comportent ni image ni fourchette salariale." : ''}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {isSaving && <span style={{ color: 'var(--primary-blue)', fontSize: '0.9rem', fontWeight: '600' }}>⌛ Sauvegarde en cours...</span>}
                        <button className="btn btn-primary" onClick={openAddModal} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.6rem', fontWeight: '700' }}>
                            + Ajouter {activeTab === 'jobs' ? 'une offre' : activeTab === 'trainings' ? 'une formation' : 'une actualité'}
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div style={{ overflowX: 'auto', background: 'white', borderRadius: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid var(--slate-100)' }}>
                    <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--slate-200)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700' }}>Titre</th>
                                {activeTab === 'jobs' ? (
                                    <>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700' }}>Entreprise</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700' }}>Lieu / Type</th>
                                    </>
                                ) : (
                                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700' }}>Image</th>
                                )}
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '700' }}>
                                    {activeTab === 'news' ? 'Date de publication' : 'Expiration'}
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '700' }}>Statut</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '700' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentList.length === 0 ? (
                                <tr>
                                    <td colSpan={activeTab === 'jobs' ? 6 : 5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-400)' }}>
                                        Aucun élément trouvé. Cliquez sur "+ Ajouter" pour en créer un.
                                    </td>
                                </tr>
                            ) : (
                                currentList.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                                        <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--slate-800)' }}>
                                            {getLocalizedContent(item.title) || '(Sans titre)'}
                                        </td>

                                        {activeTab === 'jobs' ? (
                                            <>
                                                <td style={{ padding: '1rem', color: 'var(--slate-600)', fontSize: '0.9rem' }}>
                                                    {item.company || '-'}
                                                </td>
                                                <td style={{ padding: '1rem', color: 'var(--slate-600)', fontSize: '0.9rem' }}>
                                                    <span style={{ fontWeight: '500' }}>{item.location || '-'}</span>
                                                    {item.type && <span style={{ marginLeft: '6px', background: '#eff6ff', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>{item.type}</span>}
                                                </td>
                                            </>
                                        ) : (
                                            <td style={{ padding: '1rem' }}>
                                                {item.image ? (
                                                    item.image.toLowerCase().endsWith('.pdf') ? (
                                                        <span style={{ fontSize: '1.4rem' }} title="Document PDF joint">📄 PDF</span>
                                                    ) : (
                                                        <img src={item.image} alt="" style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover', background: '#f8fafc', border: '1px solid var(--slate-200)' }} />
                                                    )
                                                ) : (
                                                    <span style={{ color: 'var(--slate-400)', fontSize: '0.8rem' }}>Aucun fichier</span>
                                                )}
                                            </td>
                                        )}

                                        <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                                            {activeTab === 'news'
                                                ? item.date || '-'
                                                : (item.expirationDate ? `${item.expirationDate} à ${item.expirationTime || '23:59'}` : '-')}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <button
                                                onClick={() => toggleStatus(item.id)}
                                                style={{
                                                    padding: '0.3rem 0.8rem',
                                                    borderRadius: '9999px',
                                                    border: 'none',
                                                    background: item.active ? '#d1fae5' : '#fee2e2',
                                                    color: item.active ? '#065f46' : '#991b1b',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                title="Cliquer pour changer le statut"
                                            >
                                                {item.active ? '● Actif' : '○ Inactif'}
                                            </button>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div className="admin-actions" style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => openEditModal(item)}
                                                    title="Modifier"
                                                    style={{ padding: '0.4rem 0.6rem', border: '1px solid var(--slate-200)', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(item.id)}
                                                    title="Supprimer définitivement"
                                                    style={{ padding: '0.4rem 0.6rem', border: '1px solid #fecaca', borderRadius: '6px', background: '#fff1f2', cursor: 'pointer' }}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Modal */}
            <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} onClick={() => setIsModalOpen(false)}>
                <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px', background: 'white', borderRadius: '1.25rem', padding: '2rem', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}>
                    <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800', color: 'var(--slate-800)' }}>
                            {editItem ? '✏️ Modifier' : '➕ Ajouter'} {activeTab === 'jobs' ? "une Offre d'emploi" : activeTab === 'trainings' ? 'une Formation' : 'une Actualité'}
                        </h3>
                        <button className="modal-close" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--slate-400)' }}>×</button>
                    </div>

                    {/* Titles */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>Titre (FR) *</label>
                            <input
                                type="text"
                                value={formData.title?.fr || ''}
                                onChange={(e) => setFormData({ ...formData, title: { ...formData.title, fr: e.target.value } })}
                                placeholder="ex: Comptable Senior"
                                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid var(--slate-300)' }}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>Titre (EN)</label>
                            <input
                                type="text"
                                value={formData.title?.en || ''}
                                onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                                placeholder="ex: Senior Accountant"
                                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid var(--slate-300)' }}
                            />
                        </div>
                    </div>

                    {/* Images & Documents for Trainings and News (NOT for Jobs) */}
                    {activeTab !== 'jobs' && (
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>
                                {activeTab === 'trainings' ? 'Image / Affiche de la formation' : "Image ou Document de l'actualité (Image ou PDF)"}
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="https://firebasestorage... ou /uploads/..."
                                    value={formData.image || ''}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    style={{ flex: 1, padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid var(--slate-300)' }}
                                />
                                <div style={{ position: 'relative' }}>
                                    <button type="button" className="btn btn-secondary" style={{ whiteSpace: 'nowrap', padding: '0.65rem 1rem' }}>
                                        📁 Importer fichier
                                    </button>
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            const uploadBtn = e.target.previousSibling;
                                            const originalText = uploadBtn.innerText;
                                            uploadBtn.innerText = '⌛ Envoi Firebase...';

                                            const uploadData = new FormData();
                                            uploadData.append('file', file);

                                            try {
                                                const res = await fetch('/api/upload', {
                                                    method: 'POST',
                                                    body: uploadData
                                                });
                                                const data = await res.json();
                                                if (data.success) {
                                                    setFormData({ ...formData, image: data.url });
                                                    uploadBtn.innerText = data.storage === 'firebase' ? '🔥 Firebase OK' : '✅ Sauvegardé';
                                                    setTimeout(() => uploadBtn.innerText = originalText, 2500);
                                                } else {
                                                    alert("Erreur lors de l'upload du fichier");
                                                    uploadBtn.innerText = '❌ Erreur';
                                                    setTimeout(() => uploadBtn.innerText = originalText, 2000);
                                                }
                                            } catch (err) {
                                                alert('Erreur réseau lors de l\'upload');
                                                uploadBtn.innerText = '❌ Erreur';
                                                setTimeout(() => uploadBtn.innerText = originalText, 2000);
                                            }
                                        }}
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            opacity: 0,
                                            cursor: 'pointer'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Job specific fields (NO salary, NO image) */}
                    {activeTab === 'jobs' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>Entreprise</label>
                                <input
                                    type="text"
                                    value={formData.company || ''}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    placeholder="ex: FMS ou Client"
                                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid var(--slate-300)' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>Lieu (Ville)</label>
                                <input
                                    type="text"
                                    value={formData.location || ''}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="ex: Kinshasa, Lubumbashi, Kolwezi..."
                                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid var(--slate-300)' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>Type de contrat</label>
                                <select
                                    value={formData.type || 'CDI'}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid var(--slate-300)' }}
                                >
                                    <option value="CDI">CDI</option>
                                    <option value="CDD">CDD</option>
                                    <option value="Stage">Stage</option>
                                    <option value="Consultant">Consultant</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>Secteur d'activité</label>
                                <input
                                    type="text"
                                    value={formData.sector || ''}
                                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                                    placeholder="ex: Informatique, Mines, Finance..."
                                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid var(--slate-300)' }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Trainings specific fields */}
                    {activeTab === 'trainings' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>Durée</label>
                                <input
                                    type="text"
                                    value={formData.duration || ''}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    placeholder="ex: 3 Heures, 2 Jours..."
                                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid var(--slate-300)' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>Prix</label>
                                <input
                                    type="text"
                                    value={formData.price || ''}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="ex: Inscription 15$ & Participation 120$"
                                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid var(--slate-300)' }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Expiration fields for Jobs and Trainings */}
                    {(activeTab === 'jobs' || activeTab === 'trainings') && (
                        <fieldset style={{ border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.25rem', background: '#f8fafc' }}>
                            <legend style={{ padding: '0 0.5rem', fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary-blue)' }}>
                                ⏰ EXPIRATION DE L'OFFRE
                            </legend>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: '600', fontSize: '0.85rem' }}>Date d'expiration</label>
                                    <input
                                        type="date"
                                        value={formData.expirationDate || ''}
                                        onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid var(--slate-300)', background: 'white' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: '600', fontSize: '0.85rem' }}>Heure d'expiration</label>
                                    <input
                                        type="time"
                                        value={formData.expirationTime || '23:59'}
                                        onChange={(e) => setFormData({ ...formData, expirationTime: e.target.value })}
                                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid var(--slate-300)', background: 'white' }}
                                    />
                                </div>
                            </div>
                        </fieldset>
                    )}

                    {/* Description */}
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>Description (FR) *</label>
                        <textarea
                            rows="4"
                            value={formData.description?.fr || ''}
                            onChange={(e) => setFormData({ ...formData, description: { ...formData.description, fr: e.target.value } })}
                            placeholder="Détails du poste ou de l'élément..."
                            style={{ width: '100%', padding: '0.75rem 0.85rem', borderRadius: '0.5rem', border: '1px solid var(--slate-300)', fontFamily: 'inherit' }}
                        />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={isSaving}
                            style={{ flex: 1, padding: '0.85rem', borderRadius: '0.6rem', fontWeight: '700' }}
                        >
                            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setIsModalOpen(false)}
                            style={{ flex: 1, padding: '0.85rem', borderRadius: '0.6rem', fontWeight: '600' }}
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
