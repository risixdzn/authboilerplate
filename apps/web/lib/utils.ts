import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function api(path: string) {
    return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
}

export function parseJwt(token: string) {
    try {
        return JSON.parse(atob(token.split(".")[1]!));
    } catch (e) {
        return null;
    }
}

export const isClientSide = (): boolean => typeof window !== "undefined";
