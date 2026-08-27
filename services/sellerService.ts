import axiosInstance from './axiosInstance';
import { SellerProfile, Product, Service, PaginatedResponse, Coupon, PayoutRequest, BankAccount } from './types';

// Profile
export const getSellerProfile = (): Promise<SellerProfile> => 
    axiosInstance.get('/api/v1/sellers/profile/').then(res => res.data);

export const patchSellerProfile = (data: Partial<SellerProfile>): Promise<SellerProfile> => 
    axiosInstance.patch('/api/v1/sellers/profile/', data).then(res => res.data);

// Products
export const getSellerProducts = (params?: any): Promise<PaginatedResponse<Product>> => 
    axiosInstance.get('/api/v1/sellers/products/', { params }).then(res => res.data);

export const createSellerProduct = (data: any): Promise<Product> => 
    axiosInstance.post('/api/v1/sellers/products/', data).then(res => res.data);

export const getSellerProductDetail = (id: number): Promise<Product> => 
    axiosInstance.get(`/api/v1/sellers/products/${id}/`).then(res => res.data);

export const updateSellerProduct = (id: number, data: any): Promise<Product> => 
    axiosInstance.put(`/api/v1/sellers/products/${id}/`, data).then(res => res.data);

export const patchSellerProduct = (id: number, data: any): Promise<Product> => 
    axiosInstance.patch(`/api/v1/sellers/products/${id}/`, data).then(res => res.data);

export const deleteSellerProduct = (id: number) => 
    axiosInstance.delete(`/api/v1/sellers/products/${id}/`);

// Services
export const getSellerServices = (params?: any): Promise<PaginatedResponse<Service>> => 
    axiosInstance.get('/api/v1/sellers/services/', { params }).then(res => res.data);

export const createSellerService = (data: any): Promise<Service> => 
    axiosInstance.post('/api/v1/sellers/services/', data).then(res => res.data);

export const getSellerServiceDetail = (id: number): Promise<Service> => 
    axiosInstance.get(`/api/v1/sellers/services/${id}/`).then(res => res.data);

export const updateSellerService = (id: number, data: any): Promise<Service> => 
    axiosInstance.put(`/api/v1/sellers/services/${id}/`, data).then(res => res.data);

export const patchSellerService = (id: number, data: any): Promise<Service> => 
    axiosInstance.patch(`/api/v1/sellers/services/${id}/`, data).then(res => res.data);

export const deleteSellerService = (id: number) => 
    axiosInstance.delete(`/api/v1/sellers/services/${id}/`);

// Orders & Dashboard
export const getSellerOrders = (params?: any): Promise<any[]> => 
    axiosInstance.get('/api/v1/sellers/orders/', { params }).then(res => res.data);

export const getSellerServiceBookings = (params?: any): Promise<any[]> => 
    axiosInstance.get('/api/v1/sellers/list/services/', { params }).then(res => res.data);

export const getOrderAnalytics = (): Promise<any> => 
    axiosInstance.get('/api/v1/sellers/orders/analytics/').then(res => res.data);

export const getSellerDashboard = (): Promise<any> => 
    axiosInstance.get('/api/v1/sellers/dashboard/').then(res => res.data);

export const updateOrderStatus = (id: number, status: string): Promise<any> => 
    axiosInstance.patch(`/api/v1/sellers/orders/${id}/status/`, { status }).then(res => res.data);

// Coupons
export const getCoupons = (): Promise<Coupon[]> => 
    axiosInstance.get('/api/v1/sellers/coupons/').then(res => res.data);

export const createCoupon = (data: any): Promise<Coupon> => 
    axiosInstance.post('/api/v1/sellers/coupons/', data).then(res => res.data);

export const patchCoupon = (id: number, data: any): Promise<Coupon> => 
    axiosInstance.patch(`/api/v1/sellers/coupons/${id}/`, data).then(res => res.data);

export const deleteCoupon = (id: number) => 
    axiosInstance.delete(`/api/v1/sellers/coupons/${id}/delete/`);

// Payouts
export const getPayoutRequests = (): Promise<PayoutRequest[]> => 
    axiosInstance.get('/api/v1/sellers/payout-requests/').then(res => res.data);

export const createPayoutRequest = (data: any): Promise<PayoutRequest> => 
    axiosInstance.post('/api/v1/sellers/payout-requests/', data).then(res => res.data);

// Bank Accounts
export const getBankAccounts = (): Promise<BankAccount[]> => 
    axiosInstance.get('/api/v1/sellers/bank-accounts/').then(res => res.data);

export const createBankAccount = (data: any): Promise<BankAccount> => 
    axiosInstance.post('/api/v1/sellers/bank-accounts/', data).then(res => res.data);

export const deleteBankAccount = (id: number) => 
    axiosInstance.delete(`/api/v1/sellers/bank-accounts/${id}/delete/`);

// Settings
export const changeSellerPassword = (data: any) => 
    axiosInstance.post('/api/v1/sellers/change-password/', data);

// Public Data
export const getPublicCategories = (): Promise<any[]> => 
    axiosInstance.get('/api/v1/public/categories/').then(res => res.data.data || res.data);

// Payout Cards
export const getPayoutCards = (): Promise<any> => 
    axiosInstance.get('/api/v1/sellers/payout/cards/').then(res => res.data.data || res.data);
