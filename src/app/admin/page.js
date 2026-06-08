'use client';

import { useState, useEffect } from 'react';
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

    const persistData = async (updatedJobs, updatedTrainings, updatedNews) => {
        setIsSaving(true);
        try {
            await fetch('/api/save-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobs: updatedJobs || jobs,
                    trainings: updatedTrainings || trainings,
                    news: updatedNews || news
                })
            });
        } catch (error) {
            console.error('Persistence error:', error);
            alert('Erreur lors de la sauvegarde sur le serveur');
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
                        <p>Accès réservé aux administrateurs</p>
                    </div>
                </section>
                <section style={{ padding: '3rem 0' }}>
                    <div className="container">
                        <div style={{ maxWidth: '400px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Connexion Admin</h3>
                            <form onSubmit={handleLogin}>
                                {error && (
                                    <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#991b1b', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                                        {error}
                                    </div>
                                )}
                                <div className="form-group">
                                    <label>Mot de passe</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Entrez le mot de passe"
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
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
            image: '',
            active: true
        };

        if (activeTab === 'jobs') {
            setFormData({
                ...baseData,
                company: '',
                location: '',
                type: 'CDI',
                salary: '',
                sector: '',
                publishDate: new Date().toISOString().split('T')[0],
                expirationDate: '',
                expirationTime: '23:59'
            });
        } else if (activeTab === 'trainings') {
            setFormData({
                ...baseData,
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
            if (editItem) {
                updatedJobs = jobs.map(j => j.id === editItem.id ? { ...formData, id: editItem.id } : j);
            } else {
                const newId = Math.max(0, ...jobs.map(j => j.id)) + 1;
                updatedJobs = [...jobs, { ...formData, id: newId }];
            }
            setJobs(updatedJobs);
        } else if (activeTab === 'trainings') {
            if (editItem) {
                updatedTrainings = trainings.map(t => t.id === editItem.id ? { ...formData, id: editItem.id } : t);
            } else {
                const newId = Math.max(0, ...trainings.map(t => t.id)) + 1;
                updatedTrainings = [...trainings, { ...formData, id: newId }];
            }
            setTrainings(updatedTrainings);
        } else {
            if (editItem) {
                updatedNews = news.map(n => n.id === editItem.id ? { ...formData, id: editItem.id } : n);
            } else {
                const newId = Math.max(0, ...news.map(n => n.id)) + 1;
                updatedNews = [...news, { ...formData, id: newId }];
            }
            setNews(updatedNews);
        }

        persistData(updatedJobs, updatedTrainings, updatedNews);
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (confirm(t('admin.confirm_delete') || 'Supprimer cet élément ?')) {
            let updatedJobs = jobs;
            let updatedTrainings = trainings;
            let updatedNews = news;

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
        let updatedJobs = jobs;
        let updatedTrainings = trainings;
        let updatedNews = news;

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

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
            <section className="page-header" style={{ marginBottom: '0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>🔐 {t('admin.title')}</h1>
                        <p>{t('admin.dashboard')}</p>
                    </div>
                    <button onClick={handleLogout} className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', padding: '0.5rem 1rem' }}>
                        Déconnexion
                    </button>
                </div>
            </section>

            <section className="admin-container">
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'white', padding: '0.5rem', borderRadius: '1rem', width: 'fit-content', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <button className={`btn ${activeTab === 'jobs' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('jobs')}>💼 Offres</button>
                    <button className={`btn ${activeTab === 'trainings' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('trainings')}>📚 Formations</button>
                    <button className={`btn ${activeTab === 'news' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('news')}>📰 Actualités</button>
                </div>

                <div className="admin-header">
                    <h2>{activeTab === 'jobs' ? 'Gérer les Offres' : activeTab === 'trainings' ? 'Gérer les Formations' : 'Gérer les Actualités'}</h2>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {isSaving && <span style={{ color: 'var(--primary-blue)', fontSize: '0.9rem' }}>⌛ Sauvegarde...</span>}
                        <button className="btn btn-primary" onClick={openAddModal}>+ Ajouter</button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Titre</th>
                                <th>Image</th>
                                <th>{activeTab === 'news' ? 'Date' : 'Expiration'}</th>
                                <th>Statut</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(activeTab === 'jobs' ? jobs : activeTab === 'trainings' ? trainings : news).map((item) => (
                                <tr key={item.id}>
                                    <td style={{ fontWeight: '600' }}>{getLocalizedContent(item.title)}</td>
                                    <td>
                                        {item.image ? <img src={item.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'contain', background: '#f8fafc' }} /> : 'No image'}
                                    </td>
                                    <td style={{ fontSize: '0.85rem' }}>
                                        {activeTab === 'news' ? item.date : (item.expirationDate ? `${item.expirationDate} ${item.expirationTime || '23:59'}` : '-')}
                                    </td>
                                    <td>
                                        <button onClick={() => toggleStatus(item.id)} style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', border: 'none', background: item.active ? '#d1fae5' : '#fee2e2', color: item.active ? '#065f46' : '#991b1b', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}>
                                            {item.active ? 'Actif' : 'Inactif'}
                                        </button>
                                    </td>
                                    <td>
                                        <div className="admin-actions" style={{ justifyContent: 'flex-end' }}>
                                            <button className="btn-edit" onClick={() => openEditModal(item)}>✏️</button>
                                            <button className="btn-delete" onClick={() => handleDelete(item.id)}>🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Modal */}
            <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} onClick={() => setIsModalOpen(false)}>
                <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                    <div className="modal-header">
                        <h3>{editItem ? 'Modifier' : 'Ajouter'}</h3>
                        <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Titre (FR)</label>
                            <input type="text" value={formData.title?.fr || ''} onChange={(e) => setFormData({ ...formData, title: { ...formData.title, fr: e.target.value } })} />
                        </div>
                        <div className="form-group">
                            <label>Titre (EN)</label>
                            <input type="text" value={formData.title?.en || ''} onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>URL de l'Image du service/offre/actu</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                placeholder="/images/example.jpg ou /uploads/..."
                                value={formData.image || ''}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                style={{ flex: 1 }}
                            />
                            <div style={{ position: 'relative' }}>
                                <button className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}>
                                    📁 Importer
                                </button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        const uploadBtn = e.target.previousSibling;
                                        const originalText = uploadBtn.innerText;
                                        uploadBtn.innerText = '⌛...';

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
                                                uploadBtn.innerText = '✅ OK';
                                                setTimeout(() => uploadBtn.innerText = originalText, 2000);
                                            } else {
                                                alert('Erreur lors de l\'upload');
                                                uploadBtn.innerText = '❌';
                                                setTimeout(() => uploadBtn.innerText = originalText, 2000);
                                            }
                                        } catch (err) {
                                            alert('Erreur réseau');
                                            uploadBtn.innerText = '❌';
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

                    {activeTab === 'jobs' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group"><label>Entreprise</label><input type="text" value={formData.company || ''} onChange={(e) => setFormData({ ...formData, company: e.target.value })} /></div>
                            <div className="form-group"><label>Lieu</label><input type="text" value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} /></div>
                            <div className="form-group"><label>Fourchette Salariale (ex: 1000$ - 2000$)</label><input type="text" value={formData.salary || ''} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} /></div>
                        </div>
                    )}

                    {activeTab === 'trainings' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group"><label>Durée</label><input type="text" value={formData.duration || ''} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} /></div>
                            <div className="form-group"><label>Prix</label><input type="text" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: e.target.value })} /></div>
                        </div>
                    )}

                    {(activeTab === 'jobs' || activeTab === 'trainings') && (
                        <fieldset style={{ border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                            <legend style={{ padding: '0 0.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-blue)' }}>EXPIRATION DE L'OFFRE</legend>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Date Expiration (2024-12-31)</label>
                                    <input type="date" value={formData.expirationDate || ''} onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Heure Expiration (HH:mm)</label>
                                    <input type="time" value={formData.expirationTime || '23:59'} onChange={(e) => setFormData({ ...formData, expirationTime: e.target.value })} />
                                </div>
                            </div>
                        </fieldset>
                    )}

                    <div className="form-group">
                        <label>Description (FR)</label>
                        <textarea rows="4" value={formData.description?.fr || ''} onChange={(e) => setFormData({ ...formData, description: { ...formData.description, fr: e.target.value } })}></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button className="btn btn-primary" onClick={handleSave} style={{ flex: 1 }}>Enregistrer</button>
                        <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }}>Annuler</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
