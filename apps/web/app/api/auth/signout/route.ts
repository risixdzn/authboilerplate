import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const cookieStore = cookies();

    cookieStore.delete("token");
    cookieStore.delete("refreshToken");

    return NextResponse.redirect(new URL("/auth/login", request.url));
}
