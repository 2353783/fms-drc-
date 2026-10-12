import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
    try {
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

        // Clean jobs to remove image and salary if present
        const cleanedJobs = (data.jobs || []).map(job => {
            const { image, salary, ...rest } = job;
            return rest;
        });

        // Ensure the data has the expected structure
        const formattedData = {
            jobs: cleanedJobs,
            trainings: data.trainings || [],
            news: data.news || []
        };

        await fs.writeFile(filePath, JSON.stringify(formattedData, null, 4), 'utf8');

        return NextResponse.json({
            success: true,
            message: 'Données enregistrées avec succès',
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
