import { axios } from "./axios";

export function emailDisplayName(email: string) {
    return email.split("@")[0];
}

export async function signOut(cookieString?: string) {
    return cookieString
        ? await axios.get("/auth/signout", { headers: { Cookie: cookieString } })
        : await axios.get("/auth/signout");
}
