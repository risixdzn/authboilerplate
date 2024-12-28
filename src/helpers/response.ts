export type ApiResponse<T = null> = {
    status: number;
    error: string | null;
    message: string;
    code: string;
    data: T | null;
};

export const apiResponse = ({ status, error, message, code, data }: ApiResponse) => {
    return { status, error, message, code, data };
};
