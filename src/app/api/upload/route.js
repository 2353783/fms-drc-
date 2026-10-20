import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ success: false, error: 'Aucun fichier fourni' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

        // 1. Sauvegarde locale immédiate garantie (sécurité anti-échec)
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, buffer);

        let downloadUrl = `/uploads/${filename}`;
        let storageType = 'local';

        // 2. Tentative de téléversement vers Firebase Storage (avec timeout court de 3s)
        try {
            const uploadToFirebasePromise = async () => {
                const storageRef = ref(storage, `documents/${filename}`);
                const metadata = {
                    contentType: file.type || 'application/octet-stream'
                };
                const uint8 = new Uint8Array(bytes);
                const snapshot = await uploadBytes(storageRef, uint8, metadata);
                return await getDownloadURL(snapshot.ref);
            };

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Firebase Storage timeout')), 3000)
            );

            downloadUrl = await Promise.race([uploadToFirebasePromise(), timeoutPromise]);
            storageType = 'firebase';
        } catch (firebaseErr) {
            console.warn('Firebase Storage non activé ou en attente dans la console Google, sauvegarde locale active:', firebaseErr.message || firebaseErr);
            // downloadUrl reste /uploads/${filename} qui est déjà écrit sur le disque !
        }

        return NextResponse.json({
            success: true,
            url: downloadUrl,
            storage: storageType,
            filename: file.name
        });
    } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        return NextResponse.json({ success: false, error: 'Erreur upload: ' + (error.message || error) }, { status: 500 });
    }
}
