import type { NextRequest } from 'next/server';
import { createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './libs/i18nNavigation';

const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/:locale/dashboard(.*)',
]);

const isAuthPage = createRouteMatcher([
  '/login(.*)',
  '/:locale/login(.*)',
  '/sign-up(.*)',
  '/:locale/sign-up(.*)',
]);

export default async function middleware(
  request: NextRequest,
  // event: NextFetchEvent,
) {
  if (
    isAuthPage(request) || isProtectedRoute(request)
  ) {
    // console.log('request', request);
    return intlMiddleware(request);
  }

  // Extract the URL pathname from the request
  const path = request.nextUrl.pathname;

  // Allow direct access to sitemap.xml and robots.txt without i18n middleware processing
  // This ensures these files are properly served for SEO purposes
  // Related to GitHub issue: https://github.com/ixartz/Next-js-Boilerplate/issues/356
  if (path === '/sitemap.xml' || path === '/robots.txt') {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|monitoring|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
