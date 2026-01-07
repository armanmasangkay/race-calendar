import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function getAdminSession() {
  const session = await auth();
  return session?.user?.isAdmin ? session : null;
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect('/');
  }
  return session;
}

export async function assertAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}

export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.isAdmin ?? false;
}
