import * as admin from 'firebase-admin';
import * as path from 'path';
import { solve } from './solver';
import { Participant } from './types';

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, '../service-account.json'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

console.log('Backend Service Initialized.');
console.log('Listening for group updates...');

// Listen to all groups
// Note: In a massive scale app, we wouldn't listen to root 'groups' forever.
// We would use Cloud Functions triggers. But for this running process:
db.collection('groups').where('status', 'in', ['open', 'voting']).onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        const groupId = change.doc.id;
        console.log(`Detected change in group ${groupId}`);

        // Setup a listener for THIS group's participants
        // We debounce this slightly in a real app, but here direct is fine
        listenToParticipants(groupId);
    });
});

const activeListeners = new Set<string>();

import { generateExplanation } from './gemini';

function listenToParticipants(groupId: string) {
    if (activeListeners.has(groupId)) return;
    activeListeners.add(groupId);

    console.log(`Starting participant listener for ${groupId}`);

    db.collection('groups').doc(groupId).collection('participants').onSnapshot(async snap => {
        if (snap.empty) return;

        console.log(`Participants updated for ${groupId}. Re-calculating...`);
        const participants: Participant[] = snap.docs.map(d => d.data() as Participant);

        try {
            const result = solve(participants);

            // Generate explanation using Gemini
            console.log("Generating explanation with Gemini...");
            const explanation = await generateExplanation(result);

            result.explanation = explanation;
            result.isAiGenerated = true;

            await db.collection('groups').doc(groupId).collection('results').doc('latest').set({
                ...result,
                computedAt: admin.firestore.FieldValue.serverTimestamp() // Use server timestamp for consistency
            });
            console.log(`Result updated for ${groupId}`);
        } catch (e) {
            console.error(`Error calculating for ${groupId}:`, e);
        }
    });
}

// Keep alive
setInterval(() => { }, 1000 * 60);
