import { signOut } from "@/lib/auth/utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const cookieStore = cookies();

    try {
        await signOut(cookieStore.toString());
    } finally {
        cookieStore.delete("token");
        cookieStore.delete("refreshToken");

        return NextResponse.redirect(new URL("/auth/login", request.url));
    }
}
