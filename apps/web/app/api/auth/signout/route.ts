import { signOut } from "@/lib/auth/utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const cookieStore = cookies();

    await signOut(cookieStore.toString());

    cookieStore.delete("token");
    cookieStore.delete("refreshToken");

    return NextResponse.redirect(new URL("/auth/login", request.url));
}
