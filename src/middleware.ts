import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh auth session
    await supabase.auth.getUser();

    // Multi-tenant: Extract Club Slug from Host
    const hostname = request.headers.get('host') || '';
    let clubSlug = '';

    // Local or Vercel preview environments
    if (
        hostname.includes('localhost') ||
        hostname.includes('vercel.app') ||
        hostname.includes('127.0.0.1')
    ) {
        clubSlug = process.env.NEXT_PUBLIC_DEV_CLUB_SLUG || 'octagon';
    } else {
        // Production: extract subdomain (e.g., octagon.yourdomain.com -> octagon)
        // Assumes 1 level of subdomain
        const parts = hostname.split('.');
        if (parts.length > 2) {
            clubSlug = parts[0];
        } else {
            // Fallback or handle root domain
            clubSlug = 'www';
        }
    }

    // Inject club slug into header for downstream use
    response.headers.set('x-club-slug', clubSlug);

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
