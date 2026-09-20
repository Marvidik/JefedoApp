import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

// IMPORTANT: On physical devices, 127.0.0.1 and localhost point to the device itself.
// Use your PC's local network IP (e.g. 192.168.x.x) when testing on a real device or Expo Go.
// Use 10.0.2.2 for Android Emulator.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://backend.jefedo.com";

console.log("🌐 [API BASE URL]:", BASE_URL);

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to handle tokens in SecureStore
const tokenStorage = {
    getAccessToken: async () => await SecureStore.getItemAsync('access_token'),
    getRefreshToken: async () => await SecureStore.getItemAsync('refresh_token'),
    getUserType: async () => await SecureStore.getItemAsync('user_type'),
    setTokens: async (access: string, refresh: string, userType?: string) => {
        if (!access || !refresh) {
            console.error("? [TOKEN MISSING]: One or both tokens are missing!", {
                access: access === undefined ? 'undefined' : access,
                refresh: refresh === undefined ? 'undefined' : refresh
            });
            return;
        }
        console.log("?? [TOKENS RECEIVED]: Storing tokens in SecureStore...");
        await SecureStore.setItemAsync('access_token', access);
        await SecureStore.setItemAsync('refresh_token', refresh);
        if (userType) await SecureStore.setItemAsync('user_type', userType);
    },
    clearTokens: async () => {
        await SecureStore.deleteItemAsync('access_token');
        await SecureStore.deleteItemAsync('refresh_token');
        await SecureStore.deleteItemAsync('user_type');
    }
};

const formatAPIError = (errorData: any) => {
    if (!errorData) {
        return { detail: "An unexpected error occurred." };
    }

    if (typeof errorData === 'object') {
        const dataField = errorData.data;
        if (dataField && typeof dataField === 'object' && !Array.isArray(dataField)) {
            const keys = Object.keys(dataField);
            if (keys.length > 0) {
                const firstKey = keys[0];
                const messages = dataField[firstKey];
                let rawMessage = '';
                if (Array.isArray(messages) && messages.length > 0) {
                    rawMessage = messages[0];
                } else if (typeof messages === 'string') {
                    rawMessage = messages;
                }

                if (rawMessage) {
                    if (firstKey === 'non_field_errors' || firstKey === 'nonFieldErrors') {
                        return {
                            ...errorData,
                            detail: rawMessage,
                            message: rawMessage,
                            non_field_errors: [rawMessage]
                        };
                    }

                    const formattedKey = firstKey
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/([0-9]+)/g, ' $1')
                        .replace(/_/g, ' ')
                        .trim()
                        .replace(/\b\w/g, (c) => c.toUpperCase());

                    const finalMsg = `${formattedKey}: ${rawMessage}`;
                    return {
                        ...errorData,
                        detail: finalMsg,
                        message: finalMsg,
                        non_field_errors: [finalMsg]
                    };
                }
            }
        }

        // Direct key-value validation errors fallback
        const keys = Object.keys(errorData);
        for (const key of keys) {
            if (key !== 'status' && key !== 'message' && key !== 'detail' && Array.isArray(errorData[key]) && errorData[key].length > 0 && typeof errorData[key][0] === 'string') {
                if (key === 'non_field_errors' || key === 'nonFieldErrors') {
                    const finalMsg = errorData[key][0];
                    return {
                        ...errorData,
                        detail: finalMsg,
                        message: finalMsg,
                        non_field_errors: [finalMsg]
                    };
                }

                const formattedKey = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/([0-9]+)/g, ' $1')
                    .replace(/_/g, ' ')
                    .trim()
                    .replace(/\b\w/g, (c) => c.toUpperCase());

                const finalMsg = `${formattedKey}: ${errorData[key][0]}`;
                return {
                    ...errorData,
                    detail: finalMsg,
                    message: finalMsg,
                    non_field_errors: [finalMsg]
                };
            }
        }

        if (errorData.detail) return errorData;
        if (errorData.message) {
            return {
                ...errorData,
                detail: errorData.message
            };
        }
    }

    return errorData;
};

// Request Interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await tokenStorage.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            if (!(global as any)._tokenLogged) {
                console.log("?? [CURRENT ACCESS TOKEN]:", token);
                (global as any)._tokenLogged = true;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor for Token Refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => {
        if (response.data &&
            typeof response.data === 'object' &&
            'status' in response.data &&
            'data' in response.data) {

            const internalStatus = response.data.status;
            if (internalStatus < 200 || internalStatus >= 300) {
                return Promise.reject({
                    response: {
                        status: internalStatus,
                        data: formatAPIError(response.data)
                    },
                    message: response.data.message || "API Internal Error"
                });
            }

            return {
                ...response,
                data: response.data.data
            };
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            const isAuthRequest = originalRequest.url?.includes('/api/v1/auth/login') || originalRequest.url?.includes('/api/v1/auth/registration');

            if (isAuthRequest) {
                return Promise.reject(error.response?.data || error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = await tokenStorage.getRefreshToken();
            if (!refreshToken) {
                await tokenStorage.clearTokens();
                router.replace('/(auth)/login');
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${BASE_URL}/api/v1/auth/token/refresh/`, {
                    refresh: refreshToken,
                });

                console.log("%c?? [REFRESH RESPONSE]:", "color: #3b82f6; font-weight: bold; font-size: 14px;", response.data);

                const resData = (response.data && response.data.data) ? response.data.data : response.data;

                const access = resData.access ||
                    resData.access_token ||
                    resData.token?.access ||
                    resData.tokens?.access ||
                    resData.token;

                const newRefresh = resData.refresh ||
                    resData.refresh_token ||
                    resData.token?.refresh ||
                    resData.tokens?.refresh ||
                    refreshToken;

                if (!access) {
                    throw new Error("Access token missing in refresh response");
                }

                await tokenStorage.setTokens(access, newRefresh);

                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                processQueue(null, access);

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                await tokenStorage.clearTokens();
                router.replace('/(auth)/login');
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(formatAPIError(error.response?.data));
    }
);

export default axiosInstance;
export { tokenStorage };
