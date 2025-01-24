import axios, { InternalAxiosRequestConfig } from "axios";
import { parseJwt } from "../../utils";

const authAxios = axios.create({
    withCredentials: true,
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const isTokenExpired = (token: string) => {
    if (!token) return true;
    const decoded = parseJwt(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
};

const revalidateToken = async (
    config: InternalAxiosRequestConfig,
    cookieString: string,
    signOutCallback: () => void
) => {
    try {
        const revalidateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieString,
            },
            body: JSON.stringify({}),
        });

        if (revalidateResponse.ok) {
            const setCookie = revalidateResponse.headers.get("Set-Cookie");

            if (setCookie) {
                config.headers.set("Set-Cookie", setCookie);
                return setCookie;
            }
        }
        return null;
    } catch (error) {
        signOutCallback();
        throw error;
    }
};

authAxios.interceptors.request.use(
    async (config) => {
        const { cookies } = await import("next/headers");
        const cookieStore = cookies();

        const token = cookieStore.get("token")?.value;

        if (token && isTokenExpired(token)) {
            const setCookie = await revalidateToken(config, cookieStore.toString(), () => {});

            config.headers.set("Set-Cookie", setCookie);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export { authAxios };
