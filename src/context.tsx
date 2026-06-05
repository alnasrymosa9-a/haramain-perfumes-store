/**
 * ===== إدارة حالة التطبيق - Supabase =====
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, Order, CartItem, Page, OrderStatus } from './types';
import { WHATSAPP_NUMBER } from './data';
import { supabase, isSupabaseConfigured } from './supabase';

interface AppContextType {
  currentPage: Page;
  navigateTo: (page: Page, data?: any) => void;
  pageData: any;
  user: any;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<Order>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  uploadImage: (file: File, bucket: string, path: string) => Promise<string>;
  whatsappNumber: string;
  sendWhatsApp: (message: string) => void;
  loading: boolean;
  dataError: string | null;
  // السلة
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'haramain_cart';

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageData, setPageData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [whatsappNumber] = useState(WHATSAPP_NUMBER);

  // السلة - محفوظة في Local Storage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // حفظ السلة في Local Storage عند التغيير
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // localStorage unavailable
    }
  }, [cart]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ===== مراقبة حالة تسجيل الدخول - Supabase =====
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAdmin(!!session?.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ===== تحميل البيانات من Supabase =====
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setDataError('Supabase غير مُعدّ. يرجى إضافة VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في ملف .env');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setDataError(null);
      try {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        if (productsData) {
          setProducts(productsData.map(p => ({
            id: p.id,
            name: p.name || '',
            category: p.category || 'perfumes',
            description: p.description || '',
            price: p.price || 0,
            quantity: p.quantity || 0,
            mainImage: p.main_image || '',
            images: Array.isArray(p.images) ? p.images : [],
            available: p.available !== false,
            featured: p.featured === true,
            createdAt: p.created_at || new Date().toISOString(),
          })));
        }

        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        if (ordersData) {
          setOrders(ordersData.map(o => ({
            id: o.id,
            customerName: o.customer_name || '',
            phone: o.phone || '',
            governorate: o.governorate || '',
            district: o.district || '',
            address: o.address || '',
            items: Array.isArray(o.items) ? o.items : [],
            totalPrice: o.total_price || 0,
            deposit: o.deposit || 0,
            transferReceipt: o.transfer_receipt || '',
            transferNumber: o.transfer_number || '',
            status: o.status || 'new',
            createdAt: o.created_at || new Date().toISOString(),
            updatedAt: o.updated_at || new Date().toISOString(),
          })));
        }
      } catch (err: any) {
        console.error('Error loading data:', err);
        setDataError(err?.message || 'خطأ في تحميل البيانات من Supabase');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Realtime subscriptions
    const productsSub = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => loadData())
      .subscribe();

    const ordersSub = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => loadData())
      .subscribe();

    return () => {
      supabase.removeChannel(productsSub);
      supabase.removeChannel(ordersSub);
    };
  }, []);

  const navigateTo = useCallback((page: Page, data?: any) => {
    setCurrentPage(page);
    setPageData(data || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!isSupabaseConfigured) {
      // fallback للتطوير فقط
      if (email === 'admin@haramain.com' && password === 'admin123') {
        setIsAdmin(true);
        return true;
      }
      return false;
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Login error:', error.message);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setIsAdmin(false);
    setUser(null);
    setCurrentPage('home');
  }, []);

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured');
      return;
    }
    try {
      const { data, error } = await supabase.from('products').insert([{
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        main_image: product.mainImage || '',
        images: product.images || [],
        available: product.available,
        featured: product.featured,
        created_at: new Date().toISOString(),
      }]).select().single();

      if (error) throw error;
      if (data) {
        setProducts(prev => [{
          id: data.id,
          name: data.name,
          category: data.category,
          description: data.description,
          price: data.price,
          quantity: data.quantity,
          mainImage: data.main_image || '',
          images: data.images || [],
          available: data.available,
          featured: data.featured,
          createdAt: data.created_at,
        }, ...prev]);
      }
    } catch (err) {
      console.error('Error adding product:', err);
      throw err;
    }
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    if (!isSupabaseConfigured) return;
    try {
      const updatePayload: Record<string, any> = {};
      if (data.name !== undefined) updatePayload.name = data.name;
      if (data.category !== undefined) updatePayload.category = data.category;
      if (data.description !== undefined) updatePayload.description = data.description;
      if (data.price !== undefined) updatePayload.price = data.price;
      if (data.quantity !== undefined) updatePayload.quantity = data.quantity;
      if (data.mainImage !== undefined) updatePayload.main_image = data.mainImage;
      if (data.images !== undefined) updatePayload.images = data.images;
      if (data.available !== undefined) updatePayload.available = data.available;
      if (data.featured !== undefined) updatePayload.featured = data.featured;

      const { error } = await supabase.from('products').update(updatePayload).eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...data } : p)));
  };

  const deleteProduct = async (id: string) => {
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Order> => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase غير مُعدّ. لا يمكن إضافة الطلبات.');
    }
    try {
      const { data, error } = await supabase.from('orders').insert([{
        customer_name: orderData.customerName,
        phone: orderData.phone,
        governorate: orderData.governorate,
        district: orderData.district,
        address: orderData.address,
        items: orderData.items,
        total_price: orderData.totalPrice,
        deposit: orderData.deposit,
        transfer_receipt: orderData.transferReceipt || '',
        transfer_number: orderData.transferNumber || '',
        status: 'new',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }]).select().single();

      if (error) throw error;
      if (!data) throw new Error('لم يتم إرجاع بيانات الطلب');

      const mapped: Order = {
        id: data.id,
        customerName: data.customer_name,
        phone: data.phone,
        governorate: data.governorate,
        district: data.district,
        address: data.address,
        items: data.items || [],
        totalPrice: data.total_price,
        deposit: data.deposit,
        transferReceipt: data.transfer_receipt || '',
        transferNumber: data.transfer_number || '',
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      setOrders(prev => [mapped, ...prev]);
      return mapped;
    } catch (err) {
      console.error('Error adding order:', err);
      throw err;
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.from('orders').update({
        status,
        updated_at: new Date().toISOString(),
      }).eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Error updating order status:', err);
      throw err;
    }
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o)));
  };

  const uploadImage = async (file: File, bucket: string, path: string): Promise<string> => {
    if (!isSupabaseConfigured) {
      return URL.createObjectURL(file);
    }
    try {
      const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });
      if (error) throw error;
      if (data) {
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
        return urlData.publicUrl;
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      throw err;
    }
    return '';
  };

  const sendWhatsApp = useCallback((message: string) => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank');
  }, [whatsappNumber]);

  // ===== دوال السلة =====
  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  return (
    <AppContext.Provider value={{
      currentPage, navigateTo, pageData,
      user, isAdmin, login, logout,
      products, addProduct, updateProduct, deleteProduct,
      orders, addOrder, updateOrderStatus,
      uploadImage, whatsappNumber, sendWhatsApp,
      loading, dataError,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      cartTotal, cartCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
