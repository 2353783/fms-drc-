import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
    try {
        const data = await request.json();
        const filePath = path.join(process.cwd(), 'src/data/offers.json');

        // Ensure the data has the expected structure
        const formattedData = {
            jobs: data.jobs || [],
            trainings: data.trainings || [],
            news: data.news || []
        };

        await fs.writeFile(filePath, JSON.stringify(formattedData, null, 4), 'utf8');

        return NextResponse.json({ success: true, message: 'Data saved successfully' });
    } catch (error) {
        console.error('Save error:', error);
        return NextResponse.json({ success: false, message: 'Failed to save data' }, { status: 500 });
    }
}
