import { db, storage } from './firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import offersFallback from '../data/offers.json';

/**
 * Récupère les données (emplois, formations, actualités) depuis Firebase Firestore
 * avec fallback sur le fichier local offers.json si nécessaire.
 */
export async function getOffersData() {
    try {
        const docRef = doc(db, 'content', 'offers');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                jobs: Array.isArray(data.jobs) ? data.jobs : [],
                trainings: Array.isArray(data.trainings) ? data.trainings : [],
                news: Array.isArray(data.news) ? data.news : []
            };
        }
    } catch (err) {
        console.warn('Firebase getDoc warning (fallback to local data):', err.message || err);
    }
    return offersFallback;
}

/**
 * Enregistre les données dans Firebase Firestore
 */
export async function saveOffersData(data) {
    const formattedData = {
        jobs: Array.isArray(data.jobs) ? data.jobs : [],
        trainings: Array.isArray(data.trainings) ? data.trainings : [],
        news: Array.isArray(data.news) ? data.news : [],
        updatedAt: new Date().toISOString()
    };
    try {
        const docRef = doc(db, 'content', 'offers');
        await setDoc(docRef, formattedData);
        return { success: true, data: formattedData };
    } catch (err) {
        console.error('Erreur Firebase saveOffersData:', err);
        throw err;
    }
}

/**
 * Upload d'un fichier (image, PDF, document) vers Firebase Storage
 * @param {File|Blob|Uint8Array} file - Le fichier à uploader
 * @param {string} fileName - Nom original du fichier
 * @param {string} folder - Dossier de destination dans Storage
 * @returns {Promise<string>} L'URL publique de téléchargement du document
 */
export async function uploadFileToFirebase(file, fileName = 'document', folder = 'actualites') {
    const timestamp = Date.now();
    const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storageRef = ref(storage, `${folder}/${timestamp}_${cleanName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
}
