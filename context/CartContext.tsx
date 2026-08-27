import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
    id: number;
    slug: string;
    name: string;
    price: number;
    originalPrice?: number;
    image?: string;
    emoji?: string;
    qty: number;
    seller: string;
    category?: string;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number) => void;
    updateQty: (id: number, qty: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    isInitialized: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from AsyncStorage on mount
    useEffect(() => {
        const loadCart = async () => {
            try {
                const savedCart = await AsyncStorage.getItem('jefedo_cart');
                if (savedCart) {
                    setCartItems(JSON.parse(savedCart));
                }
            } catch (e) {
                console.error("Failed to parse cart from AsyncStorage", e);
            } finally {
                setIsInitialized(true);
            }
        };
        loadCart();
    }, []);

    // Save to AsyncStorage whenever cart changes
    useEffect(() => {
        if (isInitialized) {
            AsyncStorage.setItem('jefedo_cart', JSON.stringify(cartItems)).catch(e => {
                console.error("Failed to save cart to AsyncStorage", e);
            });
        }
    }, [cartItems, isInitialized]);

    const addToCart = (item: CartItem) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + item.qty } : i);
            }
            return [...prev, item];
        });
    };

    const removeFromCart = (id: number) => {
        setCartItems(prev => prev.filter(i => i.id !== id));
    };

    const updateQty = (id: number, qty: number) => {
        if (qty < 1) {
            removeFromCart(id);
            return;
        }
        setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal, isInitialized }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
