import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Product, Sale } from '../types';
import { products as initialProducts } from '../data/products';

interface CartContextType {
  cart: CartItem[];
  sales: Sale[];
  products: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  completeSale: (paymentMethod: 'cash' | 'card' | 'digital', customerName?: string) => void;
  getCartTotal: () => number;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  updateStock: (productId: string, newStock: number) => void;
  deleteProduct: (productId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const completeSale = (paymentMethod: 'cash' | 'card' | 'digital', customerName?: string) => {
    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      date: new Date(),
      items: [...cart],
      total: getCartTotal(),
      paymentMethod,
      customerName,
    };
    setSales((prevSales) => [newSale, ...prevSales]);
    
    // Update product stock after sale
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        const cartItem = cart.find((item) => item.product.id === product.id);
        if (cartItem) {
          return { ...product, stock: Math.max(0, product.stock - cartItem.quantity) };
        }
        return product;
      })
    );
    
    clearCart();
  };

  const addProduct = (product: Product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  const updateProduct = (product: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === product.id ? product : p))
    );
  };

  const updateStock = (productId: string, newStock: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        sales,
        products,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        completeSale,
        getCartTotal,
        addProduct,
        updateProduct,
        updateStock,
        deleteProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};