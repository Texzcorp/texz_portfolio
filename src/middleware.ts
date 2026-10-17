import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const host = request.headers.get('host')?.split(':')[0].toLowerCase();
    const { pathname } = request.nextUrl;

    // Keep existing API clients, authentication callbacks and media URLs working.
    if (
        host !== 'terencediazportfolio.vercel.app' ||
        !['GET', 'HEAD'].includes(request.method) ||
        pathname === '/api' || pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname === '/og' ||
        /\.[a-z0-9]+$/i.test(pathname)
    ) {
        return NextResponse.next();
    }

    const destination = new URL(request.url);
    destination.protocol = 'https:';
    destination.hostname = 'portfolio.cosmocrow.com';
    destination.port = '';
    return NextResponse.redirect(destination, 308);
}

export const config = { matcher: '/:path*' };
