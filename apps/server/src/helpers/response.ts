import { type ApiResponse } from "@repo/schemas/utils";

export const apiResponse = ({ status, error, message, code, data }: ApiResponse) => {
    return { status, error, message, code, data };
};
