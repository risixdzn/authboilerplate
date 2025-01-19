export type ApiResponse = {
    status: number;
    error: string | null;
    message: string;
    code: string;
    data: unknown | null;
};

export const apiResponse = ({ status, error, message, code, data }: ApiResponse) => {
    return { status, error, message, code, data };
};
