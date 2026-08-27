import axiosInstance from './axiosInstance';
import { CheckoutResponse, ServiceCheckoutResponse } from './types';

export interface ProductCheckoutPayload {
    buyer_name: string;
    buyer_email: string;
    buyer_phone?: string;
    address: string;
    city: string;
    state: string;
    country?: string;
    postal_code?: string;
    coupon_code?: string;
    items: {
        item_id: number;
        quantity: number;
    }[];
    payment_method?: string;
}

export interface ServiceCheckoutPayload {
    buyer_name: string;
    buyer_email: string;
    buyer_phone?: string;
    booking_date: string;
    booking_time: string;
    booking_notes?: string;
    coupon_code?: string;
    items: {
        item_id: number;
        quantity: number;
    }[];
    payment_method?: string;
}

/**
 * Initiates a product order checkout.
 * After success, redirect the user to return.payment_url.
 */
export const checkoutProduct = async (data: ProductCheckoutPayload): Promise<CheckoutResponse> => {
    try {
        const response = await axiosInstance.post('/api/v1/transactions/checkout/product/', data);
        return response.data;
    } catch (error: any) {
        // Handle stock/validation errors specifically
        throw error.response?.data || { detail: "Checkout failed. Please check your cart or network." };
    }
};

/**
 * Initiates a service booking checkout.
 * After success, redirect the user to return.payment_url.
 */
export const checkoutService = async (data: ServiceCheckoutPayload): Promise<ServiceCheckoutResponse> => {
    try {
        const response = await axiosInstance.post('/api/v1/transactions/checkout/service/', data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { detail: "Booking failed. Please check date/time availability." };
    }
};

/**
 * Verifies a Paystack transaction using the payment reference.
 */
export const verifyPayment = (reference: string) => 
    axiosInstance.get(`/api/v1/transactions/checkout/verify/${reference}/`).then(res => res.data);
