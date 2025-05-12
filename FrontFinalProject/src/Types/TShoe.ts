export type TShoe = {
    _id: string;
    name: string;
    image: string;
    category: string; // 'women' | 'men' | 'kids'
    price: number;
    sizes: {
        size: number;
        inStock: boolean;
    }[];
};