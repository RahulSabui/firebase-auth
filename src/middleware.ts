// middleware.ts
import { match } from 'assert';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    let token = req.cookies.get('token');
    console.log(token, "get token");

    if (token) {
        return NextResponse.next();

    }
    return NextResponse.redirect(new URL('/login', req.url));

}

export const config = {
    matcher: ['/']
};
