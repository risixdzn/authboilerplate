import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const hasDeletedAccount = request.cookies.get("showDeletedDialog")?.value;

    const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");
    const isLoginPath = request.nextUrl.pathname.startsWith("/auth/login");
    const isForgotPasswordTokenPath = request.nextUrl.pathname.startsWith("/auth/forgot-password/");

    /**
     * Rule used to make so the user can't access the resetPassword form without providing a valid token
     *
     * The backend validates expiration, token type, if the token is used and that its not a random string.
     */
    if (isForgotPasswordTokenPath) {
        try {
            const tokenValidationResponse = await validatePasswordResetToken(request);
            if (!tokenValidationResponse) {
                return NextResponse.redirect(new URL("/auth/login", request.url));
            }
        } catch (error) {
            console.error("Error during password reset token validation:", error);
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    // Handle all login path cases first
    if (isLoginPath) {
        /**
         * If the user has deleted his account, he will get redirected to the login path, but may still have a token active on cookies.
         * This would crash the app, as the system would try to redirect him to the dashboard with a token related to a deleted account.
         * So we check for the cookie that shows the dialog and ignore the redirection to the dashboard, also deleting the possible exis.
         */
        if (hasDeletedAccount) {
            request.cookies.delete("refreshToken");
            request.cookies.delete("token");
            return NextResponse.next();
        }

        // If the user is at the loginPath and has a valid token, they need to go to dashboard.
        if (token || refreshToken) {
            return NextResponse.redirect(new URL("/dashboard/client/account", request.url));
        }

        return NextResponse.next();
    }

    //Revalidate the user JWT if its not present (cookie expired)
    if (!token) {
        try {
            const response = await revalidate(request, isProtectedRoute);
            return response;
        } catch (error) {
            console.error("Error during token revalidation:", error);

            if (isProtectedRoute) {
                return NextResponse.redirect(new URL("/auth/login", request.url));
            }

            return NextResponse.next();
        }
    }

    return NextResponse.next();
}

async function revalidate(request: NextRequest, isProtectedRoute: boolean) {
    const revalidateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: request.cookies.toString(),
        },
        body: JSON.stringify({}),
    });

    if (revalidateResponse.ok) {
        const setCookie = revalidateResponse.headers.get("Set-Cookie");

        if (setCookie) {
            const res = NextResponse.next();
            res.headers.set("Set-Cookie", setCookie);
            return res;
        }
    }

    // If refreshToken is invalid (401), clear cookies to prevent infinite loop
    if (revalidateResponse.status === 401) {
        const res = NextResponse.redirect(new URL("/auth/login", request.url));
        res.cookies.delete("refreshToken");
        res.cookies.delete("token");
        return res;
    }

    // Revalidation failed; redirect to login
    if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
}

async function validatePasswordResetToken(request: NextRequest): Promise<boolean> {
    const urlParts = request.nextUrl.pathname.split("/");
    const token = urlParts[urlParts.length - 1];

    const tokenValidationResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/credentials/password/reset?token=${token}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (tokenValidationResponse.ok) {
        const responseData = await tokenValidationResponse.json();
        return responseData.data?.valid === true;
    }

    return false;
}

export const config = {
    matcher: ["/dashboard/:path*", "/auth/login", "/auth/forgot-password/:token*"],
};
