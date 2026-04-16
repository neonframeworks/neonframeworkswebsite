import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password || typeof password !== 'string' || password.length > 256) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    // Timing-safe comparison to prevent timing attacks
    const inputHash = crypto.createHash('sha256').update(password).digest();
    const correctHash = crypto.createHash('sha256').update(adminPassword).digest();
    const isValid = crypto.timingSafeEqual(inputHash, correctHash);

    if (!isValid) {
      // Consistent response time even on failure
      await new Promise((r) => setTimeout(r, 300 + Math.random() * 200));
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await generateToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24h
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
