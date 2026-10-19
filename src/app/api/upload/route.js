import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

        let downloadUrl = null;
        let storageType = 'local';

        // 1. Sauvegarde dans Firebase Storage
        try {
            const storageRef = ref(storage, `documents/${filename}`);
            const metadata = {
                contentType: file.type || 'application/octet-stream'
            };
            const snapshot = await uploadBytes(storageRef, buffer, metadata);
            downloadUrl = await getDownloadURL(snapshot.ref);
            storageType = 'firebase';
        } catch (firebaseErr) {
            console.warn('Firebase Storage non disponible ou restreint, utilisation du stockage local:', firebaseErr.message || firebaseErr);
        }

        // 2. Toujours sauvegarder une copie locale dans public/uploads si possible
        try {
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            try {
                await fs.access(uploadDir);
            } catch {
                await fs.mkdir(uploadDir, { recursive: true });
            }
            const filePath = path.join(uploadDir, filename);
            await fs.writeFile(filePath, buffer);
            if (!downloadUrl) {
                downloadUrl = `/uploads/${filename}`;
            }
        } catch (localErr) {
            console.warn('Écriture locale impossible (environnement serverless/read-only):', localErr.message);
        }

        if (!downloadUrl) {
            throw new Error('Échec de la sauvegarde sur Firebase et sur le stockage local');
        }

        return NextResponse.json({
            success: true,
            url: downloadUrl,
            storage: storageType,
            filename: file.name
        });
    } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        return NextResponse.json({ error: 'Erreur upload: ' + (error.message || error) }, { status: 500 });
    }
}
