import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const snapshot = await adminDb.collection('contacts').orderBy('createdAt', 'desc').get();
    
    // Convert Firestore DocumentSnapshot into raw JSON
    const contacts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? { seconds: data.createdAt._seconds ?? data.createdAt.seconds } : null,
      };
    });

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}
