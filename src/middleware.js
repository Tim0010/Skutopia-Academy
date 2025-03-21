import { NextResponse } from 'next/server';
import { join } from 'path';
import fs from 'fs';

export async function middleware(request) {
  // Handle favicon.ico requests separately
  if (request.nextUrl.pathname === '/favicon.ico') {
    try {
      // No filesystem access in middleware, so we'll redirect to the static asset
      return NextResponse.redirect(new URL('/favicon.ico?v=1', request.url));
    } catch (error) {
      console.error('Error handling favicon request:', error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// Configure middleware to run only for specific paths
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|assets|favicon.svg|apple-touch-icon.png|manifest.json).*)',
  ],
}; 