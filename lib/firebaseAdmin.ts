import admin from "firebase-admin";

function formatPrivateKey(key: string | undefined): string {
    if (!key) {
        throw new Error("FIREBASE_PRIVATE_KEY is missing");
    }

    return key
        .replace(/^"(.*)"$/, '$1') // remove quotes
        .replace(/\\n/g, '\n');   // fix newlines
}

const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        }),
    });
}

export const adminDb = admin.firestore();