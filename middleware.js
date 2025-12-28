import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function middleware(request) {
    const { pathname } = request.nextUrl

    // Protect admin routes
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        const cookieStore = await cookies()
        const sessionId = cookieStore.get('admin_session')?.value

        if (!sessionId) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}

