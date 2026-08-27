import axiosInstance from './axiosInstance';
import { ReferralCode, ReferralHistory, ReferralStats } from './types';

export const claimReferral = (code: string): Promise<any> =>
    axiosInstance.post('/api/v1/referrals/claim/', { referral_code: code }).then(res => res.data);

export const getMyCode = (): Promise<ReferralCode> =>
    // Interceptor unwraps envelope; res.data is the inner data object
    axiosInstance.get('/api/v1/referrals/me/code/').then(res => res.data);

export const getReferralHistory = (): Promise<ReferralHistory[]> =>
    axiosInstance.get('/api/v1/referrals/me/referrals/').then(res => res.data.results || res.data || []);

export const getReferralStats = (): Promise<ReferralStats> =>
    axiosInstance.get('/api/v1/referrals/me/stats/').then(res => res.data);
