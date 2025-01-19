export type ApiResponse<T = unknown> = {
    status: number;
    error: string | null;
    message: string;
    code: string;
    data: T | null;
};
