import { IncomingMessage, ServerResponse } from 'http';
import * as admin from 'firebase-admin';
import { solve } from '../src/solver';
import { generateExplanation } from '../src/gemini';
import { Participant } from '../src/types';

// Helper to parse body if needed (Vercel parsers usually handle this, but for type safety)
interface VercelRequest extends IncomingMessage {
    body: any;
}
interface VercelResponse extends ServerResponse {
    status: (code: number) => VercelResponse;
    json: (body: any) => void;
    send: (body: any) => void;
}

// Initialize Firebase Admin
if (!admin.apps.length) {
    // In Vercel, we'll pass the service account JSON as an environment variable
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (serviceAccountJson) {
        try {
            const serviceAccount = JSON.parse(serviceAccountJson);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } catch (e) {
            console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env var", e);
        }
    } else {
        console.warn("FIREBASE_SERVICE_ACCOUNT env var not set. Firebase init might fail.");
    }
}

const db = admin.firestore();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { groupId } = req.body;

        if (!groupId) {
            return res.status(400).json({ error: 'Missing groupId' });
        }

        console.log(`Processing calculation for group ${groupId}`);

        // Fetch group participants
        const participantsSnap = await db.collection('groups').doc(groupId).collection('participants').get();
        if (participantsSnap.empty) {
            return res.status(404).json({ error: 'No participants found for this group' });
        }

        const participants: Participant[] = participantsSnap.docs.map(d => d.data() as Participant);

        // Run Logic
        const result = solve(participants);

        // Generate explanation
        const explanation = await generateExplanation(result);
        result.explanation = explanation;
        result.isAiGenerated = true;

        // Save result
        await db.collection('groups').doc(groupId).collection('results').doc('latest').set({
            ...result,
            computedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return res.status(200).json({ success: true, result });

    } catch (error) {
        console.error('Error handling request:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) });
    }
}
