import axiosInstance from './axiosInstance';
import { Wallet, Transaction } from './types';

export const getWallet = (): Promise<Wallet> =>
    // Interceptor already unwraps { status, message, data } → res.data IS the inner data object
    axiosInstance.get('/api/v1/wallets/').then(res => res.data);

export const initiateFunding = (amount: number): Promise<{ payment_url: string; reference: string; access_code: string; amount: string }> =>
    axiosInstance.post('/api/v1/wallets/fund/initiate/', { amount }).then(res => res.data);

export const verifyFunding = (reference: string): Promise<any> =>
    axiosInstance.get(`/api/v1/wallets/fund/verify/${reference}/`).then(res => res.data);

export const getTransactions = (): Promise<Transaction[]> =>
    axiosInstance.get('/api/v1/wallets/transactions/').then(res => res.data.results || res.data || []);
