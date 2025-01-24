import { NextRequest, NextResponse } from "next/server";
// import { parseJwt } from "./lib/utils";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");
    const isLoginPath = request.nextUrl.pathname.startsWith("/auth/login");

    if (isLoginPath && !token) {
        return NextResponse.next();
    }

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

    // const jwtPayload = parseJwt(token as string);
    // const isExpired = jwtPayload?.exp ? Date.now() >= jwtPayload.exp * 1000 : true;

    // console.log(jwtPayload, isExpired);

    // if (isExpired) {
    //     try {
    //         const response = await revalidate(request, isProtectedRoute);
    //         return response;
    //     } catch (error) {
    //         console.error("Error during token revalidation:", error);

    //         return NextResponse.redirect(new URL("/auth/login", request.url));
    //     }
    // }

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

export const config = {
    matcher: ["/dashboard/:path*", "/auth/login"],
};
