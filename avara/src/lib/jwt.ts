import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JWTPayload {
  customer_id: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT token for a customer
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Extract customer ID from JWT token
 */
export function extractCustomerIdFromToken(token: string): string | null {
  const payload = verifyToken(token);
  return payload?.customer_id || null;
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = verifyToken(token);
  if (!payload || !payload.exp) {
    return true;
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
} 