import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewSubmissionNotification(data: {
  title: string | null;
  url: string;
  submitterIp: string | null;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

  if (!adminEmail || !process.env.RESEND_API_KEY) {
    console.warn('Email not configured, skipping notification');
    return;
  }

  await resend.emails.send({
    from: 'Race Calendar <onboarding@resend.dev>',
    to: adminEmail,
    subject: 'New Event Submission',
    html: `
      <h2>New Event Submitted</h2>
      <p><strong>Title:</strong> ${data.title || 'Not provided'}</p>
      <p><strong>URL:</strong> <a href="${data.url}">${data.url}</a></p>
      <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL || ''}/queue">Review in Queue</a></p>
    `,
  });
}
