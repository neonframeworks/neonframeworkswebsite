import { SignJWT, jwtVerify } from 'jose';

const SECRET = process.env.ADMIN_TOKEN_SECRET || 'fallback-secret-change-in-prod';
const key = new TextEncoder().encode(SECRET);

export async function generateToken(): Promise<string> {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
  return token;
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload.role === 'admin';
  } catch {
    return false;
  }
}
