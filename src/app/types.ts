export interface Product {
  id: string;
  name: string;
  category: 'rings' | 'necklaces' | 'bracelets' | 'earrings' | 'watches';
  price: number;
  description: string;
  material: string;
  stock: number;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  date: Date;
  items: CartItem[];
  total: number;
  paymentMethod: 'cash' | 'card' | 'digital';
  customerName?: string;
}
