import { signOut } from "@/lib/auth/utils";
import { cookieKey } from "@repo/constants/cookies";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const cookieStore = cookies();

    try {
        await signOut(cookieStore.toString());
    } finally {
        cookieStore.delete(cookieKey("session"));
        cookieStore.delete(cookieKey("refreshToken"));

        return NextResponse.redirect(new URL("/auth/login", request.url));
    }
}
