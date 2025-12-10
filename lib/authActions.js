"use server"

import { cookies } from "next/headers";

const TOKEN_COOKIE_NAME = 'auth-token';
const MAX_AGE_OF_COOKIE = 60 * 60 * 24 * 7;

/**
 * @description Securely sets the HTTP-only cookie on the server after login.
 * Supports security principle of defense against XSS.
 */

export async function setAuthCookieAction (token){
    console.log("batao bhai kya gadbad hn");
    if(!token) return;

    cookies().set(TOKEN_COOKIE_NAME, token,{
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: MAX_AGE_OF_COOKIE ,
        path:'/',
        sameSite:'lax',

    })
}

/**
 * @description Removes the HTTP-only cookie on the server (for logout).
 */


export async function removeAuthCookieAction(){
    cookies().delete(TOKEN_COOKIE_NAME);
}

/**
 * @description Retrieves the token from the cookie (used for SSR/Server Components verification).
 */

export async function getAuthTokenAction() {
    return cookies().get(TOKEN_COOKIE_NAME)?.value || null;
}