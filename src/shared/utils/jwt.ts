// 간단한 JWT 구현 (실제 프로덕션에서는 jose 등 라이브러리 사용 권장)
const SECRET_KEY = "dino_jwt_secret_key_2024";
const EXPIRES_IN = 24 * 60 * 60 * 1000; // 24시간

interface JwtPayload {
  userId: string;
  email: string;
  exp: number;
}

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return atob(str);
}

async function createSignature(header: string, payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${header}.${payload}.${SECRET_KEY}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return base64UrlEncode(hashArray.map((b) => String.fromCharCode(b)).join(""));
}

export async function generateToken(userId: string, email: string): Promise<string> {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64UrlEncode(
    JSON.stringify({
      userId,
      email,
      exp: Date.now() + EXPIRES_IN,
    })
  );
  const signature = await createSignature(header, payload);
  return `${header}.${payload}.${signature}`;
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const expectedSignature = await createSignature(header, payload);

    if (signature !== expectedSignature) return null;

    const decoded = JSON.parse(base64UrlDecode(payload)) as JwtPayload;

    if (decoded.exp < Date.now()) return null;

    return decoded;
  } catch {
    return null;
  }
}
