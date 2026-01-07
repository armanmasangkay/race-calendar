import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isAdmin = req.auth?.user?.isAdmin;

  if (!isAdmin) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/events/new', '/events/:id/edit', '/queue'],
};
