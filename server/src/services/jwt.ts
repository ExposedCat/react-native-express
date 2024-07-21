import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY as string;

interface TokenPayload {
  userId: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, secretKey);
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, secretKey) as TokenPayload;
  } catch {
    return null;
  }
};

export const decodeToken = (token: string): TokenPayload | null => {
  const decoded = jwt.decode(token);
  return decoded ? (decoded as TokenPayload) : null;
};
