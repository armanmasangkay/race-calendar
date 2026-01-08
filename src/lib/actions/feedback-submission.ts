'use server';

import { db } from '@/lib/db';
import { feedbackQueue } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { visitorFeedbackSchema } from '@/lib/validations/feedback';
import { verifyCaptcha, generateCaptcha } from '@/lib/captcha';
import { headers } from 'next/headers';

// Rate limiting: stricter than event submissions to prevent spam
const feedbackCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 2; // 2 feedback submissions per hour
const RATE_WINDOW_MS = 60 * 60 * 1000; // per hour

function checkRateLimit(ip: string): { allowed: boolean; error?: string } {
  const now = Date.now();
  const record = feedbackCounts.get(ip);

  if (!record || now > record.resetAt) {
    feedbackCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, error: 'Too many submissions. Please try again later.' };
  }

  record.count++;
  return { allowed: true };
}

export async function getFeedbackCaptchaChallenge() {
  const captcha = generateCaptcha();
  return {
    question: captcha.question,
    token: captcha.token,
  };
}

export async function submitFeedback(formData: FormData) {
  // Get client IP for rate limiting
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0]?.trim() || 'unknown';

  // Check rate limit
  const rateLimitResult = checkRateLimit(ip);
  if (!rateLimitResult.allowed) {
    return { success: false, error: rateLimitResult.error };
  }

  const rawData = {
    type: formData.get('type') as string,
    description: formData.get('description') as string,
    email: formData.get('email') as string,
    captchaAnswer: formData.get('captchaAnswer') as string,
    captchaToken: formData.get('captchaToken') as string,
    website: formData.get('website') as string, // honeypot
  };

  // Validate input
  const parseResult = visitorFeedbackSchema.safeParse(rawData);
  if (!parseResult.success) {
    const firstError = parseResult.error.issues[0];
    return { success: false, error: firstError.message };
  }

  // Verify captcha
  const captchaResult = verifyCaptcha(rawData.captchaToken, rawData.captchaAnswer);
  if (!captchaResult.valid) {
    return { success: false, error: captchaResult.error };
  }

  // Insert into database
  try {
    await db.insert(feedbackQueue).values({
      type: parseResult.data.type,
      description: parseResult.data.description,
      email: parseResult.data.email || null,
      status: 'pending',
      submitterIp: ip,
    });

    revalidatePath('/admin/feedback');

    return { success: true };
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    return { success: false, error: 'Failed to submit. Please try again.' };
  }
}
