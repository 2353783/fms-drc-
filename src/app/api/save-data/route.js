import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getOffersData, saveOffersData } from '@/lib/firebaseService';

export async function GET() {
    try {
        // 1. Essayer de récupérer les données depuis Firebase Firestore
        try {
            const firebaseData = await getOffersData();
            if (firebaseData && (
                (firebaseData.jobs && firebaseData.jobs.length > 0) ||
                (firebaseData.trainings && firebaseData.trainings.length > 0) ||
                (firebaseData.news && firebaseData.news.length > 0)
            )) {
                return NextResponse.json(firebaseData, {
                    headers: {
                        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                });
            }
        } catch (fbErr) {
            console.warn('Lecture Firebase impossible, repli sur local:', fbErr.message || fbErr);
        }

        // 2. Repli sur le fichier local offers.json
        const filePath = path.join(process.cwd(), 'src/data/offers.json');
        const fileContent = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
    } catch (error) {
        console.error('Read error in save-data API:', error);
        return NextResponse.json({ jobs: [], trainings: [], news: [] }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const filePath = path.join(process.cwd(), 'src/data/offers.json');

        // Nettoyer les offres d'emploi (pas d'image ni de salaire)
        const cleanedJobs = (data.jobs || []).map(job => {
            const { image, salary, ...rest } = job;
            return rest;
        });

        // Formater les données
        const formattedData = {
            jobs: cleanedJobs,
            trainings: data.trainings || [],
            news: data.news || []
        };

        let savedToFirebase = false;

        // 1. Enregistrer dans Firebase Firestore
        try {
            await saveOffersData(formattedData);
            savedToFirebase = true;
        } catch (fbErr) {
            console.warn('Enregistrement Firebase Firestore échoué:', fbErr.message || fbErr);
        }

        // 2. Enregistrer une copie de sécurité locale dans offers.json
        try {
            await fs.writeFile(filePath, JSON.stringify(formattedData, null, 4), 'utf8');
        } catch (fsErr) {
            console.warn('Écriture locale offers.json impossible:', fsErr.message);
        }

        return NextResponse.json({
            success: true,
            message: savedToFirebase
                ? 'Données et documents enregistrés sur Firebase avec succès !'
                : 'Données enregistrées localement (Firebase en attente de synchronisation).',
            firebaseSynced: savedToFirebase,
            data: formattedData
        }, {
            headers: {
                'Cache-Control': 'no-store'
            }
        });
    } catch (error) {
        console.error('Save error in save-data API:', error);
        return NextResponse.json({ success: false, message: 'Échec de la sauvegarde des données' }, { status: 500 });
    }
}
