import { randomBytes } from 'crypto';

/**
 * Generate a cryptographically secure nonce for CSP
 * @returns {string} Base64 encoded nonce
 */
export function generateNonce(): string {
  return randomBytes(16).toString('base64');
}

/**
 * CSP nonce utility for Next.js
 */
export class CSPNonce {
  private static nonce: string | null = null;

  /**
   * Get or generate a nonce for the current request
   */
  static getNonce(): string {
    if (!this.nonce) {
      this.nonce = generateNonce();
    }
    return this.nonce;
  }

  /**
   * Reset nonce (for new requests)
   */
  static reset(): void {
    this.nonce = null;
  }
}
