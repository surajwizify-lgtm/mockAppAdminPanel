import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function proxy(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/api/mobile")) {
        return NextResponse.next()
    }
    const session = await auth()
    const isLoggedIn = !!session
    const isLoginPage = request.nextUrl.pathname === '/login'

    if (!isLoggedIn && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (isLoggedIn && isLoginPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}