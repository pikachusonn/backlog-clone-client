import { sendPost } from "./axios"

export const login = async (payload: { email: string, password: string }) => {
    const response = await sendPost(`/auth/login`, payload);
    return response;
}