import admin from "firebase-admin";

function formatPrivateKey(key: string | undefined): string {
    if (!key) return '';
    let formattedKey = key;
    
    // Parse JSON just in case they pasted the whole Service Account JSON
    if (formattedKey.trim().startsWith('{')) {
        try {
            const parsed = JSON.parse(formattedKey);
            if (parsed.private_key) formattedKey = parsed.private_key;
        } catch (e) {}
    }

    // Strip wrapping quotes
    if (formattedKey.startsWith('"') && formattedKey.endsWith('"')) {
        formattedKey = formattedKey.slice(1, -1);
    } else if (formattedKey.startsWith("'") && formattedKey.endsWith("'")) {
        formattedKey = formattedKey.slice(1, -1);
    }

    // Force unescaping of literal string "\n" to actual hardware newlines
    formattedKey = formattedKey.split('\\n').join('\n');
    
    // Catch edge-case where @next/env parses "\\n" as a backslash followed by a real newline
    formattedKey = formattedKey.replace(/\\\n/g, '\n');

    return formattedKey.trim();
}

const certKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: certKey,
            }),
        });
    } catch (e) {
        console.warn('Firebase Admin init bypassed during build due to credentials format. It will re-attempt at runtime.');
    }
}

export const adminDb = admin.firestore();