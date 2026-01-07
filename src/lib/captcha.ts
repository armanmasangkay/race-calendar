import { createHmac, randomInt } from 'crypto';

const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET || 'fallback-secret-change-in-production';
const CAPTCHA_VALIDITY_MS = 5 * 60 * 1000; // 5 minutes

interface CaptchaChallenge {
  question: string;
  answer: number;
  token: string;
}

export function generateCaptcha(): CaptchaChallenge {
  const a = randomInt(1, 10);
  const b = randomInt(1, 10);
  const answer = a + b;
  const timestamp = Date.now();

  // Create signed token: timestamp|answer, signed with HMAC
  const data = `${timestamp}|${answer}`;
  const signature = createHmac('sha256', CAPTCHA_SECRET).update(data).digest('hex');
  const token = Buffer.from(`${data}|${signature}`).toString('base64');

  return {
    question: `What is ${a} + ${b}?`,
    answer,
    token,
  };
}

export function verifyCaptcha(token: string, userAnswer: string): { valid: boolean; error?: string } {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [timestampStr, answerStr, signature] = decoded.split('|');

    const timestamp = parseInt(timestampStr, 10);
    const expectedAnswer = parseInt(answerStr, 10);

    // Check expiry
    if (Date.now() - timestamp > CAPTCHA_VALIDITY_MS) {
      return { valid: false, error: 'Captcha expired. Please try again.' };
    }

    // Verify signature
    const data = `${timestamp}|${expectedAnswer}`;
    const expectedSignature = createHmac('sha256', CAPTCHA_SECRET).update(data).digest('hex');
    if (signature !== expectedSignature) {
      return { valid: false, error: 'Invalid captcha.' };
    }

    // Check answer
    const userAnswerNum = parseInt(userAnswer.trim(), 10);
    if (userAnswerNum !== expectedAnswer) {
      return { valid: false, error: 'Incorrect answer. Please try again.' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid captcha format.' };
  }
}
