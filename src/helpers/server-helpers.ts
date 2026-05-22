import crypto from 'crypto';

export function validateCodeSignature(code: string, receivedSignature: string, secret: string): boolean {
  const expectedSignature = crypto.createHmac('sha256', secret).update(code, 'utf8').digest('hex');
  return expectedSignature === receivedSignature;
}
