import { NextResponse } from 'next/server';

export async function GET() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName) {
    return NextResponse.json({ error: 'Cloud name missing' }, { status: 500 });
  }

  if (!apiKey || !apiSecret) {
    return NextResponse.json({ error: 'CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET is missing from .env.local' }, { status: 400 });
  }

  try {
    const base64Auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/usage`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${base64Auth}`
      },
      next: { revalidate: 3600 } // Cache data so we don't bombard the Cloudinary API
    });
    
    if (!res.ok) {
      const data = await res.json();
      return NextResponse.json({ error: data.error?.message || 'Failed to fetch usage from Cloudinary' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ 
      credits: data.credits || {},
      storage: data.storage || {}
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
