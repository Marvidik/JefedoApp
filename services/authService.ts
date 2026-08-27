import axiosInstance, { tokenStorage } from './axiosInstance';
import { JWT, User } from './types';

export interface TwoFactorLoginResponse {
    two_factor_required: true;
    detail: string;
    email: string;
}

export const login = async (data: any): Promise<JWT | TwoFactorLoginResponse> => {
    try {
        const response = await axiosInstance.post('/api/v1/auth/login/', data);
        console.log("%c📥 [LOGIN DATA]:", "color: #00ff00; font-weight: bold; font-size: 14px;", response.data);
        
        // If 2FA is required, return the response without storing tokens
        if (response.data.two_factor_required) {
            return response.data as TwoFactorLoginResponse;
        }

        const access = response.data.access || response.data.access_token;
        const refresh = response.data.refresh || response.data.refresh_token;
        const userType = response.data.user?.user_type;
        
        await tokenStorage.setTokens(access, refresh, userType);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const verifyLoginOtp = async (data: { email: string; otp: number }): Promise<JWT> => {
    try {
        const response = await axiosInstance.post('/api/v1/auth/login/verify-otp/', data);
        console.log("%c📥 [2FA VERIFY DATA]:", "color: #00ff00; font-weight: bold; font-size: 14px;", response.data);

        const access = response.data.access || response.data.access_token;
        const refresh = response.data.refresh || response.data.refresh_token;
        const userType = response.data.user?.user_type;

        await tokenStorage.setTokens(access, refresh, userType);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const register = async (data: any): Promise<JWT> => {
    try {
        const response = await axiosInstance.post('/api/v1/auth/registration/', data);
        const access = response.data.access || response.data.access_token;
        const refresh = response.data.refresh || response.data.refresh_token;
        const userType = response.data.user?.user_type;
        await tokenStorage.setTokens(access, refresh, userType);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const logout = async () => {
    try {
        await axiosInstance.post('/api/v1/auth/logout/');
    } finally {
        await tokenStorage.clearTokens();
    }
};

export const verifyEmail = (data: { key: string }) => 
    axiosInstance.post('/api/v1/auth/registration/verify-email/', data);

export const resendVerificationEmail = (data: { email: string }) => 
    axiosInstance.post('/api/v1/auth/registration/resend-email/', data);

export const resetPassword = (data: { email: string }) => 
    axiosInstance.post('/api/v1/auth/password/reset/', data);

export const requestPasswordReset = (data: { email: string }) => 
    axiosInstance.post('/api/v1/auth/password/reset/request/', data);

export const resetPasswordConfirm = (data: any) => 
    axiosInstance.post('/api/v1/auth/password/reset/confirm/', data);

export const completePasswordReset = (data: { email: string; otp: string; new_password: string }) => 
    axiosInstance.post('/api/v1/auth/password/reset/complete/', data);

export const changePassword = (data: any) => 
    axiosInstance.post('/api/v1/auth/password/change/', data);

export const getCurrentUser = (): Promise<User> => 
    axiosInstance.get('/api/v1/auth/user/').then(res => res.data);

export const updateCurrentUser = (data: any): Promise<User> => 
    axiosInstance.put('/api/v1/auth/user/', data).then(res => res.data);

export const patchCurrentUser = (data: any): Promise<User> => 
    axiosInstance.patch('/api/v1/auth/user/', data).then(res => res.data);

export const refreshToken = (refresh: string): Promise<{ access: string; access_token?: string }> => 
    axiosInstance.post('/api/v1/auth/token/refresh/', { refresh }).then(res => res.data);

export const verifyToken = (token: string) => 
    axiosInstance.post('/api/v1/auth/token/verify/', { token });
