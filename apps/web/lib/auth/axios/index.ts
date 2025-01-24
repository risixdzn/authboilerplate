import { authAxios as axiosServer } from "./server";
import { axiosClient } from "./client";

export const axios = {
    server: axiosServer,
    client: axiosClient,
};
