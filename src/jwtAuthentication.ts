import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ALGORITHM = 'ES256';
const JWT_ISSUER = 'cdp';
const EXPIRATION_SECONDS = 120;

export function generateToken(apiKey: string, apiSecret: string, uri: string): string {
    const payload = {
        iss: JWT_ISSUER,
        nbf: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + EXPIRATION_SECONDS,
        sub: apiKey,
        uri,
    };

    const header = {
        alg: ALGORITHM,
        kid: apiKey,
        nonce: crypto.randomBytes(16).toString('hex'),
    };
    const options: jwt.SignOptions = {
        algorithm: ALGORITHM as jwt.Algorithm,
        header: header,
    };

    return jwt.sign(payload, apiSecret, options);
}
