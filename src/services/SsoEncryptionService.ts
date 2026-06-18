import { createCipheriv, createDecipheriv } from 'crypto';

export type SsoServiceConfig = {
  SecretKey: string;
  IV: Buffer;
  Algorithm: string;
};

export class SsoEncryptionService {
  serviceConfig: SsoServiceConfig;

  constructor(serviceConfig: SsoServiceConfig) {
    this.serviceConfig = serviceConfig;
  }

  encrypt(val: string): string {
    let cipher = createCipheriv(
      this.serviceConfig.Algorithm,
      this.serviceConfig.SecretKey,
      this.serviceConfig.IV
    );
    let encrypted = cipher.update(val, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  decrypt(encrypted: string): string {
    let decipher = createDecipheriv(
      this.serviceConfig.Algorithm,
      this.serviceConfig.SecretKey,
      this.serviceConfig.IV
    );
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    return decrypted + decipher.final('utf8');
  }
}

export const ssoEncryptionService = new SsoEncryptionService({
  SecretKey: process.env.SHG_SSO_SECRET_KEY ?? '',
  IV: Buffer.alloc(16, 0),
  Algorithm: process.env.SHG_SSO_ENCRYPTION_ALG ?? 'aes-256-cbc',
});

export const otpTokenEncryptionService = new SsoEncryptionService({
  SecretKey: process.env.OTP_TOKEN_KEY ?? '',
  IV: Buffer.alloc(16, 0),
  Algorithm: process.env.SHG_SSO_ENCRYPTION_ALG ?? 'aes-256-cbc',
});
