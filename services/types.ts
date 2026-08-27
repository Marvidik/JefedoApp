export interface User {
    id: number;
    pk?: number;
    username?: string;
    email: string;
    first_name: string;
    last_name: string;
    user_type?: 'BUYER' | 'MERCHANT' | 'CUSTOMER';
    phone?: string;
}

export interface JWT {
    access: string;
    refresh: string;
    access_token?: string;
    refresh_token?: string;
    user: User;
}

export interface UserProfile {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    gender?: 'MALE' | 'FEMALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY';
    date_of_birth?: string;
    bio?: string;
    two_factor_enabled?: boolean;
    notify_order_updates: boolean;
    notify_promotions: boolean;
    notify_new_arrivals: boolean;
    notify_price_drops: boolean;
    notify_review_reminders: boolean;
    notify_newsletter: boolean;
    notify_sms: boolean;
    notify_push: boolean;
    total_orders: string;
}

export interface Address {
    id: number;
    label: string;
    full_name: string;
    street_address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string | null;
    phone: string;
    is_default: boolean;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    parent?: number | null;
}

export interface SellerProfile {
    id: number;
    store_name: string;
    slug: string;
    description: string;
    logo?: string | null;
    banner?: string | null;
    location: string;
    rating: number;
    review_count: number;
    positive_feedback_pct: number;
    shipping_time: string;
    response_rate_pct: number;
    is_verified: boolean;
    rc_number?: string;
    business_type?: string;
    business_address?: string;
    phone_number?: string;
}
export interface ShopDetail extends SellerProfile {}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: string;
    original: string;
    rating: number;
    review_count: number;
    stock_qty: number;
    stock_sold: number;
    image: string | null;
    status: 'DRAFT' | 'PUBLISHED';
    created_at: string;
    updated_at: string;
    category?: number | null;
    shop: string;
    is_new?: boolean;
    is_best_seller?: boolean;
    discount?: number;
    emoji?: string;
    specifications?: Record<string, string> | null;
    image2?: string | null;
    image3?: string | null;
    image4?: string | null;
}

export interface ProductDetail extends Product {
    seller: SellerProfile;
    reviews: Review[];
    rating_stats: string;
    specs: [string, string][];
    specifications?: Record<string, string>;
}

export interface Service {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: string;
    original: string;
    duration?: number | null;
    rating: number;
    review_count: number;
    image: string | null;
    status: 'DRAFT' | 'PUBLISHED';
    created_at: string;
    updated_at: string;
    category?: number | null;
    emoji?: string;
    image2?: string | null;
    image3?: string | null;
    image4?: string | null;
}

export interface ServiceDetail extends Service {
    provider: SellerProfile;
    seller: SellerProfile;
    reviews: Review[];
    rating_stats: any;
}

export interface Review {
    id: number;
    user_name: string;
    user_initial: string;
    rating: 1 | 2 | 3 | 4 | 5;
    comment: string;
    is_verified_purchase: boolean;
    created_at: string;
}

export interface OrderItem {
    id: number;
    product?: number;
    service?: number | null;
    product_name?: string;
    service_name?: string;
    name?: string;
    image?: string;
    item_type?: string;
    quantity: number;
    price: string;
}

export interface Order {
    id: number;
    buyer_name: string;
    buyer_email: string;
    buyer_phone: string | null;
    order_type?: 'PRODUCT' | 'SERVICE';
    total_amount: string;
    revenue?: string | number;
    net_profit?: string | number;
    status: 'PENDING' | 'PAID' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
    status_display?: string;
    created_at: string;
    order_date?: string;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    postal_code?: string | null;
    items: OrderItem[];
}

export interface Coupon {
    id: number;
    code: string;
    discount_type: 'PERCENTAGE' | 'FIXED';
    discount_value: string;
    usage_limit: number;
    used_count: number;
    expiry_date: string;
    status: string;
    created_at: string;
}

export interface BankAccount {
    id: number;
    bank_name: string;
    account_name: string;
    account_number: string;
    is_default: boolean;
    created_at: string;
    seller: number;
}

export interface PayoutRequest {
    id: number;
    amount: string;
    status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
    created_at: string;
    updated_at: string;
    seller: number;
    bank_account: number;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface CheckoutResponse {
    order_id: number;
    reference: string;
    payment_url: string;
    access_code: string;
    total_amount: string;
    discount_amount: string;
}

export interface ServiceCheckoutResponse extends CheckoutResponse {
    booking_date: string;
    booking_time: string;
}

export interface Wishlist {
    id: number;
    product: Product;
    created_at: string;
}

export interface AppNotification {
    id: number;
    title: string;
    message: string;
    notification_type: string;
    is_read: boolean;
    created_at: string;
}

export interface Wallet {
    id: number;
    currency: string;
    balance: string;
    status: string;
    created_at: string;
}

export interface Transaction {
    id: number;
    reference: string;
    type: string;
    direction: 'CREDIT' | 'DEBIT';
    amount: string;
    balance_before: string;
    balance_after: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    order?: number;
    description: string;
    created_at: string;
}

export interface ReferralCode {
    code: string;
    is_active: boolean;
    created_at: string;
}

export interface ReferralHistory {
    id: string;
    referrer_email: string;
    status: string;
    status_display: string;
    created_at: string;
    qualified_at: string | null;
    rewarded_at: string | null;
}

export interface ReferralStats {
    code: string;
    total_referrals: number;
    successful_referrals: number;
    pending_referrals: number;
    total_earned: string;
    reward_per_referral: string;
    minimum_funding: string;
}
