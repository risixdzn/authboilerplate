import { userJWT } from "@repo/schemas/auth";
import { axios } from "./axios";
import { parseCookies } from "nookies";
import { parseJwt } from "../utils";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookieKey } from "@repo/constants/cookies";

export function emailDisplayName(email: string) {
    return email.split("@")[0];
}

export async function signOut(cookieString?: string) {
    return cookieString
        ? await axios.get("/auth/signout", { headers: { Cookie: cookieString } })
        : await axios.get("/auth/signout");
}

export function getSession(cookies?: ReadonlyRequestCookies) {
    if (cookies) {
        const jwt = parseJwt(cookies.get(cookieKey("session"))?.value);
        return userJWT.parse(jwt);
    }

    const cookieStore = parseCookies();
    const jwt = parseJwt(cookieStore[cookieKey("session")]); // Corrected access using cookieKey
    return userJWT.parse(jwt);
}
