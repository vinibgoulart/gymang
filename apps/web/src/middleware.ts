import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
  const nextPage = NextResponse.next();
  const token = request.cookies.get('userToken');

  if (!token) {
    const loginURL = new URL('/login', request.url);

    return NextResponse.redirect(loginURL);
  }

  return nextPage;
}

export const config = {
  matcher: ['/((?!_next|login|register|favicon.ico).*)'],
};
