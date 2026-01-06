/* eslint-disable @typescript-eslint/no-explicit-any */
import { configs } from "@/constant/config";
import Axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = Axios.create({
    timeout: 3 * 60 * 1000,
    baseURL: configs.API_DOMAIN,
});


let isRefreshing = false;
let failedQueue: any = [];
const processQueue = (error: any, token: string | null | undefined = null) => {
    failedQueue.forEach((prom: any) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.request.use(
    (config: any) => {
        // eslint-disable-next-line no-param-reassign
        const token = Cookies.get("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // if (
        //     config.data &&
        //     typeof config.data === "object" &&
        //     !(
        //         config.data instanceof FormData ||
        //         config.data instanceof ArrayBuffer ||
        //         config.data instanceof Blob
        //     )
        // ) {
        //     config.data = trimStringValues(config.data, {
        //         skipKeys: [
        //             "password",
        //             "salonBoardPassword",
        //             "newPassword",
        //             "currentPassword",
        //         ],
        //     });
        // }

        // if (config.params && typeof config.params === "object") {
        //     config.params = trimStringValues(config.params);
        // }

        return config;
    },
    (error: any) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
        const originalConfig = error.config;

        const { response } = error || {};
        const { data } = response || {};
        const { errorKey } = data || {};

        if (
            ["User_Blocked", "Store_Blocked"].includes(
                error?.response?.data?.errorCode
            )
        ) {
            // logout(true);
            return Promise.reject({ notShowError: true });
        }

        if (error.response.status !== 401) {
            return Promise.reject(error);
        }
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) {
            // logout(true);
            console.log('logged out');

            return Promise.reject(error);
        }
        if (
            ((error.response && error.response.status === 401) ||
                errorKey === "Token_Expired") &&
            !originalConfig.retry
        ) {
            if (isRefreshing) {
                try {
                    const queuePromise: any = await new Promise(
                        (resolve: any, reject: any) => {
                            failedQueue.push({ resolve, reject });
                        }
                    );
                    originalConfig.headers.Authorization = `Bearer ${queuePromise.token}`;
                    return axiosInstance(originalConfig);
                } catch (err) {
                    return Promise.reject(err);
                }
            }
        }
        originalConfig.retry = true;
        isRefreshing = true;
        return Axios.post(`${configs.API_DOMAIN}/api/core/auth/refresh`, {
            refreshToken,
        })
            .then((res: any) => {
                if ([200, 201].includes(res.status)) {
                    const data = res.data.data.accessToken;
                    Cookies.set("token", data, { expires: 7 });
                    originalConfig.headers.Authorization = `Bearer ${data}`;

                    const branchId = Cookies.get("branchId");
                    if (branchId) {
                        originalConfig.headers["X-Branch-Id"] = branchId;
                    }
                    processQueue(null, data);
                    return Axios(originalConfig);
                } else {
                    // logout();
                    return Promise.reject(error);
                }
            })
            .catch((err) => {
                // logout();
                processQueue(err, null);
                return Promise.reject(error);
            })
            .finally(() => {
                isRefreshing = false;
            });
    }
);

export default axiosInstance;

export const sendGet = <T = any>(url: string, params?: any) =>
    axiosInstance.get<T>(url, { params }).then((res) => res.data);
export const sendPost = <T = any>(
    url: string,
    params?: any,
    queryParams?: any
) =>
    axiosInstance
        .post<T>(url, params, { params: queryParams })
        .then((res) => res.data);
export const sendPut = <T = any>(url: string, params?: any, queryParams?: any) =>
    axiosInstance.put<T>(url, params, { params: queryParams }).then((res) => res.data);
export const sendPatch = (url: string, params?: any) =>
    axiosInstance.patch(url, params).then((res) => res.data);
export const sendDelete = (url: string, params?: any) =>
    axiosInstance.delete(url, { params }).then((res) => res.data);
