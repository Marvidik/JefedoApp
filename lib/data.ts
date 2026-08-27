export interface Review {
    id: number;
    user: string;
    avatar?: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    reviews: number;
    reviewsList?: Review[];
    image?: string;
    emoji?: string;
    isBestSeller?: boolean;
    isNew?: boolean;
    brand: string;
    category: string;
    inStock: boolean;
    stockQuantity: number;
    seller: string;
    description: string;
    soldCount?: number;
    specs?: [string, string][];
}

export interface Service {
    id: number;
    name: string;
    price: number;
    rating: number;
    reviewsCount: number;
    reviewsList: Review[];
    image?: string;
    emoji: string;
    provider: string;
    category: string;
    description: string;
    isActive: boolean;
    location?: string;
    originalPrice?: number;
}

export const CATEGORIES = [
    { icon: '🧥', label: 'Fashion', slug: 'fashion' },
    { icon: '💻', label: 'Electronics', slug: 'electronics' },
    { icon: '🏠', label: 'Home & Living', slug: 'home' },
    { icon: '✨', label: 'Health & Beauty', slug: 'beauty' },
    { icon: '⚽', label: 'Sports', slug: 'sports' },
    { icon: '🧸', label: 'Toys', slug: 'toys' },
    { icon: '🛒', label: 'Groceries', slug: 'groceries' },
    { icon: '🚗', label: 'Automotive', slug: 'automotive' },
];

export const SERVICE_CATEGORIES = [
    { icon: '✂️', label: 'Personal Care', slug: 'personal' },
    { icon: '🧹', label: 'Cleaning', slug: 'cleaning' },
    { icon: '🛠️', label: 'Repairs', slug: 'repairs' },
    { icon: '🎨', label: 'Design', slug: 'design' },
    { icon: '💻', label: 'Tech Support', slug: 'tech' },
];

const MOCK_REVIEWS: Review[] = [
    { id: 1, user: 'Alex Johnson', rating: 5, comment: 'Absolutely amazing! Exceeded my expectations.', date: '2024-03-15' },
    { id: 2, user: 'Sarah Miller', rating: 4, comment: 'Very good quality, though shipping took a bit longer than expected.', date: '2024-03-10' },
    { id: 3, user: 'Michael Chen', rating: 5, comment: 'Best purchase I\'ve made this year. High recommended!', date: '2024-03-05' },
];

export const ALL_PRODUCTS: Product[] = [
    { 
        id: 1, name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', price: 279000, originalPrice: 399000, discount: 30, rating: 4.9, reviews: 5621, 
        reviewsList: MOCK_REVIEWS, stockQuantity: 12,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 
        emoji: '🎧', isBestSeller: true, brand: 'Sony', category: 'electronics', inStock: true, seller: 'Sony Official',
        description: 'Industry-leading noise cancellation with 8 microphones and two processors. Premium sound quality and clear calls.',
        specs: [['Battery', '30 Hours'], ['Connection', 'Bluetooth 5.2'], ['Weight', '250g']]
    },
    { 
        id: 2, name: 'iPhone 15 Pro Max 256GB Titanium', price: 1199000, originalPrice: 1299000, discount: 8, rating: 4.8, reviews: 8920, 
        reviewsList: MOCK_REVIEWS.slice(0, 2), stockQuantity: 5,
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80', 
        emoji: '📱', brand: 'Apple', category: 'electronics', inStock: true, seller: 'Apple Direct',
        description: 'Titanium design with A17 Pro chip. Pro camera system with 5x Telephoto lens and Action button.',
        specs: [['Display', '6.7" OLED'], ['Chip', 'A17 Pro'], ['Camera', '48MP Pro']]
    },
    { 
        id: 3, name: 'Apple AirPods Pro 2nd Gen with MagSafe Case', price: 199000, originalPrice: 249000, discount: 20, rating: 4.8, reviews: 12450, 
        reviewsList: MOCK_REVIEWS, stockQuantity: 28,
        image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80', 
        emoji: '🎵', isNew: true, brand: 'Apple', category: 'electronics', inStock: true, seller: 'Apple Direct',
        description: 'Active Noise Cancellation and Adaptive Transparency. Personalized Spatial Audio with dynamic head tracking.',
        specs: [['Chip', 'H2'], ['Battery', '6 Hours (per charge)'], ['Resistance', 'IPX4']]
    },
    { 
        id: 4, name: 'Men\'s Vintage Leather Biker Jacket', price: 180000, originalPrice: 250000, discount: 28, rating: 4.7, reviews: 850, 
        reviewsList: MOCK_REVIEWS.slice(1), stockQuantity: 8,
        image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=800&q=80', 
        emoji: '🧥', brand: 'Jefedo Fashion', category: 'fashion', inStock: true, seller: 'Authentic Leather Co.',
        description: 'Premium cowhide leather with distressed finish. Classic biker silhouette with asymmetrical zip.',
        specs: [['Material', '100% Cowhide'], ['Lining', 'Viscose'], ['Style', 'Slim Fit']]
    },
    { 
        id: 5, name: 'Nike Air Max 270 React Sneakers', price: 120000, originalPrice: 160000000, discount: 25, rating: 4.6, reviews: 2100, 
        reviewsList: MOCK_REVIEWS, stockQuantity: 15,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 
        emoji: '👟', isBestSeller: true, brand: 'Nike', category: 'fashion', inStock: true, seller: 'Nike Official',
        description: 'Nike Air Max 270 React uses lightweight, layered, no-sew materials to create a modern look that feels as good as it looks.',
        specs: [['Cushioning', 'Max Air 270'], ['Upper', 'Synthetic/Textile'], ['Closure', 'Laces']]
    },
    { 
        id: 6, name: 'Floral Print Summer Midi Dress', price: 45000000, originalPrice: 75000, discount: 40, rating: 4.5, reviews: 340, 
        reviewsList: MOCK_REVIEWS.slice(0, 1), stockQuantity: 20,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80', 
        emoji: '👗', isNew: true, brand: 'Mila', category: 'fashion', inStock: true, seller: 'Mila Fashion House',
        description: 'Elegant floral midi dress perfect for summer outings. Soft breathable fabric with adjustable straps.',
        specs: [['Fabric', 'Polyester'], ['Length', 'Midi'], ['Pattern', 'Floral']]
    },
    { 
        id: 7, name: 'Rolex Submariner Date Blue Dial', price: 14500000, originalPrice: 16000000000, discount: 9, rating: 4.9, reviews: 156, 
        reviewsList: MOCK_REVIEWS, stockQuantity: 2,
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80', 
        emoji: '⌚', brand: 'Rolex', category: 'fashion', inStock: true, seller: 'LuxWatch',
        description: 'Iconic divers\' watch. Corrosion-resistant Cerachrom bezel and Chromalight display for visibility.',
        specs: [['Movement', 'automatic'], ['Waterproof', '300m'], ['Case', '41mm Oystersteel']]
    },
    { 
        id: 8, name: 'Modern Velvet 3-Seater Sofa', price: 899000, originalPrice: 1200000, discount: 25, rating: 4.8, reviews: 420, 
        reviewsList: MOCK_REVIEWS, stockQuantity: 4,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', 
        emoji: '🛋️', isBestSeller: true, brand: 'HomeSense', category: 'home', inStock: true, seller: 'Modern Home',
        description: 'Luxurious velvet sofa with gold-finish metal legs. High-density foam cushions for maximum comfort.',
        specs: [['Material', 'Velvet'], ['Frame', 'Kiln-dried hardwood'], ['Seats', '3 People']]
    },
    { 
        id: 9, name: 'Minimalist Oak Wood Coffee Table', price: 250000, originalPrice: 350000, discount: 28, rating: 4.7, reviews: 650, 
        reviewsList: MOCK_REVIEWS, stockQuantity: 10,
        image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&q=80', 
        emoji: '☕', brand: 'OakStyle', category: 'home', inStock: true, seller: 'OakStyle Furnishings',
        description: 'Solid oak wood coffee table with a clean, Scandinavian design. Durable matte finish.',
        specs: [['Material', 'Solid Oak'], ['Dimensions', '110x60x45cm'], ['Weight', '18kg']]
    },
    { 
        id: 10, name: 'Samsung 65" QLED 4K Smart TV', price: 1200000, originalPrice: 1800000, discount: 33, rating: 4.9, reviews: 2450, 
        reviewsList: MOCK_REVIEWS, stockQuantity: 6,
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80', 
        emoji: '📺', isBestSeller: true, brand: 'Samsung', category: 'electronics', inStock: true, seller: 'Samsung Store',
        description: '100% Color Volume with Quantum Dot. Quantum Processor Lite with 4K Upscaling.',
        specs: [['Screen Size', '65"'], ['Resolution', '4K (3840 x 2160)'], ['HDR', 'Quantum HDR']]
    },
    { 
        id: 11, name: 'Vitamin C Brightening Serum', price: 35000, originalPrice: 55000, discount: 36, rating: 4.8, reviews: 3200, 
        reviewsList: MOCK_REVIEWS, stockQuantity: 50,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80', 
        emoji: '🧴', isBestSeller: true, brand: 'GlowUP', category: 'beauty', inStock: true, seller: 'GlowUP Beauty',
        description: 'Potent Vitamin C formula to brighten skin tone and reduce dark spots. Infused with Hyaluronic Acid.',
        specs: [['Volume', '30ml'], ['Key Ingredient', '20% Vitamin C'], ['Skin Type', 'All']]
    },
    { 
        id: 12, name: 'Mountain Trail Bike 29"', price: 850000, originalPrice: 1100000, discount: 22, rating: 4.7, reviews: 180, 
        reviewsList: MOCK_REVIEWS, stockQuantity: 3,
        image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80', 
        emoji: '🚲', brand: 'TrailMaster', category: 'sports', inStock: true, seller: 'BikeHub',
        description: 'Performance MTB with 29-inch wheels. Aluminum alloy frame with adjustable front suspension.',
        specs: [['Frame', 'Aluminum Alloy'], ['Gears', '21 Speed'], ['Brakes', 'Dual Disc']]
    },
    { 
        id: 13, name: 'TechWizard Custom Gaming Desktop PC', price: 2499000, originalPrice: 2800000, discount: 10, rating: 5.0, reviews: 15, 
        reviewsList: MOCK_REVIEWS, stockQuantity: 2,
        image: 'https://images.unsplash.com/photo-1587202372470-6812865bf73c?w=800&q=80', 
        emoji: '🖥️', isNew: true, brand: 'TechWizard', category: 'electronics', inStock: true, seller: 'TechWizard',
        description: 'Hand-built custom gaming PC with RTX 4080 and Liquid Cooling. Optimized for 4K gaming and professional streaming.',
        specs: [['GPU', 'RTX 4080'], ['CPU', 'i9-14900K'], ['RAM', '64GB DDR5']]
    },
    { 
        id: 14, name: 'TechWizard Pro Mechanical Keyboard', price: 159000, originalPrice: 199000, discount: 20, rating: 4.8, reviews: 42, 
        reviewsList: MOCK_REVIEWS, stockQuantity: 10,
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80', 
        emoji: '⌨️', brand: 'TechWizard', category: 'electronics', inStock: true, seller: 'TechWizard',
        description: 'Custom-tuned mechanical keyboard with silent linear switches and RGB backlighting.',
        specs: [['Switches', 'Linear'], ['Hot-swap', 'Yes'], ['Keycaps', 'PBT']]
    },
];

export const ALL_SERVICES: Service[] = [
    {
        id: 1, name: 'Professional Mobile Barbering', price: 35000, rating: 4.9, reviewsCount: 128, 
        reviewsList: MOCK_REVIEWS, emoji: '✂️', provider: 'Styles by David', category: 'personal',
        description: 'Get a premium haircut in the comfort of your own home. Expert in fades, beard trims, and classic styles.',
        isActive: true,
        image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80'
    },
    {
        id: 2, name: 'Full House Deep Cleaning', price: 120000, rating: 4.8, reviewsCount: 85, 
        reviewsList: MOCK_REVIEWS.slice(0, 2), emoji: '🧹', provider: 'EcoClean Pros', category: 'cleaning',
        description: 'Comprehensive house cleaning using eco-friendly products. We cover every corner, from kitchen to bedrooms.',
        isActive: true,
        image: 'https://images.unsplash.com/photo-1581578731548-c64695ce6958?w=800&q=80'
    },
    {
        id: 3, name: 'Personal Fitness Training', price: 50000, rating: 5.0, reviewsCount: 42, 
        reviewsList: MOCK_REVIEWS, emoji: '🏋️', provider: 'FitLife Coaching', category: 'personal',
        description: 'One-on-one fitness coaching tailored to your goals. Includes nutritional advice and workout plans.',
        isActive: true,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80'
    },
    {
        id: 4, name: 'High-Performance PC Repair', price: 75000, rating: 4.7, reviewsCount: 156, 
        reviewsList: MOCK_REVIEWS.slice(1), emoji: '💻', provider: 'TechWizard', category: 'tech',
        description: 'Expert PC diagnostic and repair. Hardware upgrades, software troubleshooting, and virus removal.',
        isActive: true,
        image: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?w=800&q=80'
    },
    {
        id: 5, name: 'Custom Brand Identity Design', price: 450000000, rating: 4.9, reviewsCount: 64, 
        reviewsList: MOCK_REVIEWS, emoji: '🎨', provider: 'Creative Pulse', category: 'design',
        description: 'Get a professional brand identity for your business. Includes logo design, color palette, and brand guidelines.',
        isActive: true,
        image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&q=80'
    }
];
