import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function middleware(request) {
    const { pathname } = request.nextUrl

    // Add header to identify login page
    const response = NextResponse.next()
    if (pathname === '/admin/login') {
        response.headers.set('x-is-login-page', 'true')
    }

    // Protect admin routes
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        const cookieStore = await cookies()
        const sessionId = cookieStore.get('admin_session')?.value

        if (!sessionId) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return response
}

export const config = {
    matcher: ['/admin/:path*'],
}

