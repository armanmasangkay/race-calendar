'use server';

import { db } from '@/lib/db';
import { eventQueue } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { visitorSubmissionSchema } from '@/lib/validations/queue';
import { verifyCaptcha, generateCaptcha } from '@/lib/captcha';
import { headers } from 'next/headers';

// Rate limiting: simple in-memory store (for production scale, use Redis)
const submissionCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // 5 submissions
const RATE_WINDOW_MS = 60 * 60 * 1000; // per hour

function checkRateLimit(ip: string): { allowed: boolean; error?: string } {
  const now = Date.now();
  const record = submissionCounts.get(ip);

  if (!record || now > record.resetAt) {
    submissionCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, error: 'Too many submissions. Please try again later.' };
  }

  record.count++;
  return { allowed: true };
}

export async function getCaptchaChallenge() {
  const captcha = generateCaptcha();
  return {
    question: captcha.question,
    token: captcha.token,
  };
}

export async function submitVisitorEvent(formData: FormData) {
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
    url: formData.get('url') as string,
    title: formData.get('title') as string,
    captchaAnswer: formData.get('captchaAnswer') as string,
    captchaToken: formData.get('captchaToken') as string,
    website: formData.get('website') as string, // honeypot
  };

  // Validate input
  const parseResult = visitorSubmissionSchema.safeParse(rawData);
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
    await db.insert(eventQueue).values({
      url: parseResult.data.url,
      title: parseResult.data.title,
      source: 'visitor',
      submitterIp: ip,
      notes: null,
    });

    revalidatePath('/queue');

    return { success: true };
  } catch (error) {
    console.error('Failed to submit event:', error);
    return { success: false, error: 'Failed to submit. Please try again.' };
  }
}
