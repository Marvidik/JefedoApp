import axiosInstance from './axiosInstance';
import { Category, Product, ProductDetail, Service, ServiceDetail, ShopDetail, Review, PaginatedResponse } from './types';

// Categories
export const getCategories = (): Promise<Category[]> => 
    axiosInstance.get('/api/v1/public/categories/').then(res => res.data);

// Products
export const getProducts = (params?: any): Promise<PaginatedResponse<Product>> => 
    axiosInstance.get('/api/v1/public/products/', { params }).then(res => res.data);

export const getProductDetail = (slug: string): Promise<ProductDetail> => 
    axiosInstance.get(`/api/v1/public/products/${slug}/`).then(res => res.data);

export const getFeaturedProduct = (): Promise<Product> => 
    axiosInstance.get('/api/v1/public/products/featured/').then(res => res.data);

export const getAlmostSoldOutProducts = (): Promise<Product[]> => 
    axiosInstance.get('/api/v1/public/products/almost-sold-out/').then(res => res.data);

// Services
export const getServices = (params?: any): Promise<PaginatedResponse<Service>> => 
    axiosInstance.get('/api/v1/public/services/', { params }).then(res => res.data);

export const getServiceDetail = (slug: string): Promise<ServiceDetail> => 
    axiosInstance.get(`/api/v1/public/services/${slug}/`).then(res => res.data);

// Shops
export const getShopDetail = (slug: string): Promise<ShopDetail> => 
    axiosInstance.get(`/api/v1/public/shops/${slug}/`).then(res => res.data);

export const getShopListings = (slug: string): Promise<any> => 
    axiosInstance.get(`/api/v1/public/shops/${slug}/listings/`).then(res => res.data);

// Reviews
export const createReview = (data: Partial<Review> & { product?: number; service?: number }): Promise<Review> => 
    axiosInstance.post('/api/v1/public/reviews/', data).then(res => res.data);
