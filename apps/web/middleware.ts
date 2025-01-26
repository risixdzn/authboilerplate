import { NextRequest, NextResponse } from "next/server";
// import { parseJwt } from "./lib/utils";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

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

    /**
     * This excludes the login path to check if the user have a token.
     * The login path is only on the matcher because we need to redirect to dashboard if the user already is logged in.
     */
    if (isLoginPath && !token) {
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

    // If the user is at the loginPath and passed on the isLoginPath && !token early return, he is logged in and needs to go to dashboard.
    if (isLoginPath) {
        return NextResponse.redirect(new URL("/dashboard/client/account", request.url));
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
