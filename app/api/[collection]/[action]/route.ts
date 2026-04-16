import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyToken } from '@/lib/auth';
const ALLOWED_COLLECTIONS = ['portfolio', 'logos', 'testimonials', 'contacts', 'highlights', 'youtube_videos'];
function sanitize(obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj;
  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = value.replace(/[<>'"]/g, '').trim();
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { collection: string; action: string } }
) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { collection, action } = params;

    if (!ALLOWED_COLLECTIONS.includes(collection)) {
      return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
    }

    // Explicitly prevent non-admin routes from altering contacts via this admin endpoint (except delete)
    if (collection === 'contacts' && action !== 'delete') {
      return NextResponse.json({ error: 'Action not allowed' }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...data } = body;

    const sanitizedData = sanitize(data);

    if (action === 'add') {
      const docRef = await adminDb.collection(collection).add({
        ...sanitizedData,
        createdAt: FieldValue.serverTimestamp(),
      });
      return NextResponse.json({ success: true, id: docRef.id });
    } 
    
    if (action === 'update') {
      if (!id) return NextResponse.json({ error: 'Missing document ID' }, { status: 400 });
      await adminDb.collection(collection).doc(id).update(sanitizedData);
      return NextResponse.json({ success: true });
    } 
    
    if (action === 'delete') {
      if (!id) return NextResponse.json({ error: 'Missing document ID' }, { status: 400 });
      await adminDb.collection(collection).doc(id).delete();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error(`Error in /api/${params?.collection}/${params?.action}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
