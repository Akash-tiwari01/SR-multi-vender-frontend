import { NextResponse } from 'next/server';

// Define the core list of protected paths
const PROTECTED_PATHS = [
    '/dashboard', 
    '/profile', 
    '/settings',
    '/'
    // Add more base protected paths here...
];


export const config = {
    // We manually list all required paths including their sub-path matchers.
    // This is necessary because Next.js compilation cannot execute the array mapping function.
    matcher: [
        // Public Paths for routing logic
        '/login',
        '/register',
        // Protected Paths and their sub-paths (Manually Expanded)
        '/dashboard',
        '/dashboard/:path*',
        '/profile',
        '/profile/:path*',
        '/settings',
        '/settings/:path*',
        
        // Add more protected path entries here if needed:
        // '/admin',
        // '/admin/:path*',
    ],
};


// ------------------------------------------------------------
// Proxy Logic (This remains dynamic)
// ------------------------------------------------------------

export function proxy(request) {
    console.log("``````````````````me middleware hu ``````````````````````````````````````````");
    const pathname = request.nextUrl.pathname;
    console.log(pathname);
    // 1. Get the Auth Token
    const token = request.cookies.get('auth_token')?.value;

    // Check if the current path is one of the protected paths (dynamic check still necessary here)
    const isProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path));
    const isLoginPage = pathname.startsWith('/login');

    // --- Logic 1: Unauthenticated User accessing Protected Routes ---
    if (!token && isProtected) {
        const loginUrl = new URL('/user/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // --- Logic 2: Authenticated User accessing Login Page ---
    if (token && isLoginPage) {
        const homeUrl = new URL('/', request.url);
        return NextResponse.redirect(homeUrl);
    }
    
    return NextResponse.next();
}