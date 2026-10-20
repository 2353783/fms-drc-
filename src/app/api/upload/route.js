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

        let downloadUrl = null;
        let storageType = 'unknown';

        // 1. Priorité N°1 : Téléversement vers Firebase Storage
        try {
            const uploadToFirebase = async () => {
                const storageRef = ref(storage, `documents/${filename}`);
                const metadata = {
                    contentType: file.type || 'application/octet-stream'
                };
                const uint8 = new Uint8Array(bytes);
                const snapshot = await uploadBytes(storageRef, uint8, metadata);
                return await getDownloadURL(snapshot.ref);
            };

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Firebase Storage timeout (4s)')), 4000)
            );

            downloadUrl = await Promise.race([uploadToFirebase(), timeoutPromise]);
            storageType = 'firebase';
        } catch (firebaseErr) {
            console.warn('Firebase Storage non disponible ou en attente d\'activation:', firebaseErr.message || firebaseErr);
        }

        // 2. Si Firebase Storage n'est pas encore actif, tentative sauvegarde locale disque (environnement dev/serveur dédié)
        if (!downloadUrl) {
            try {
                const uploadDir = path.join(process.cwd(), 'public', 'uploads');
                await fs.mkdir(uploadDir, { recursive: true });
                const filePath = path.join(uploadDir, filename);
                await fs.writeFile(filePath, buffer);
                downloadUrl = `/uploads/${filename}`;
                storageType = 'local';
            } catch (fsErr) {
                // Sur Vercel ou environnement serverless (système de fichiers read-only /var/task),
                // on bascule proprement sur Data URL (Base64) pour que l'image fonctionne sans jamais crasher !
                console.warn('Système de fichiers en lecture seule (Vercel/Serverless), fallback Data URL:', fsErr.message);
                const mime = file.type || 'image/jpeg';
                downloadUrl = `data:${mime};base64,${buffer.toString('base64')}`;
                storageType = 'base64';
            }
        }

        return NextResponse.json({
            success: true,
            url: downloadUrl,
            storage: storageType,
            filename: file.name
        });
    } catch (error) {
        console.error('Erreur critique lors de l\'upload:', error);
        return NextResponse.json({ success: false, error: 'Erreur upload: ' + (error.message || error) }, { status: 500 });
    }
}
