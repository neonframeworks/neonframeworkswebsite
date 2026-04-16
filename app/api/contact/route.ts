import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

// Sanitize input to prevent XSS/injection
function sanitize(input: string): string {
  return input.replace(/[<>'"&]/g, '').trim().slice(0, 2000);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    const cleanName = sanitize(String(name));
    const cleanEmail = sanitize(String(email));
    const cleanPhone = sanitize(String(phone));
    const cleanMessage = sanitize(String(message));

    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    if (cleanName.length < 2 || cleanMessage.length < 10) {
      return NextResponse.json({ error: 'Input too short' }, { status: 400 });
    }

    await adminDb.collection('contacts').add({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      message: cleanMessage,
      createdAt: FieldValue.serverTimestamp(),
      ip: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact submit error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
