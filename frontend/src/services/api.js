import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('luxe_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const path = window.location.pathname;
      if (!path.includes('/login') && !path.includes('/register')) {
        localStorage.removeItem('luxe_token');
        localStorage.removeItem('luxe_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// Admin API — different token
const AdminAPI = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });
AdminAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('luxe_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────────
export const authService = {
  register:   (data) => API.post('/auth/register', data),
  login:      (data) => API.post('/auth/login', data),
  adminLogin: (data) => API.post('/auth/admin/login', data),
  getProfile: ()     => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// ── Products ──────────────────────────────────────────────
export const productService = {
  getAll:   (params) => API.get('/products', { params }),
  getOne:   (slug)   => API.get(`/products/${slug}`),
  create:   (data)   => AdminAPI.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:   (id, data) => AdminAPI.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:   (id)     => AdminAPI.delete(`/products/${id}`),
};

// ── Categories ────────────────────────────────────────────
export const categoryService = {
  getAll:  ()        => API.get('/categories'),
  create:  (data)    => AdminAPI.post('/categories', data),
  update:  (id, data) => AdminAPI.put(`/categories/${id}`, data),
  delete:  (id)      => AdminAPI.delete(`/categories/${id}`),
};

// ── Cart ──────────────────────────────────────────────────
export const cartService = {
  get:        ()     => API.get('/cart'),
  add:        (data) => API.post('/cart/add', data),
  updateItem: (itemId, qty) => API.put(`/cart/item/${itemId}`, { quantity: qty }),
  removeItem: (itemId) => API.delete(`/cart/item/${itemId}`),
  clear:      ()     => API.delete('/cart/clear'),
};

// ── Orders ────────────────────────────────────────────────
export const orderService = {
  place:       (data)   => API.post('/orders', data),
  getMyOrders: ()       => API.get('/orders/my'),
  getDetail:   (num)    => API.get(`/orders/${num}`),
};

// ── Admin ─────────────────────────────────────────────────
export const adminService = {
  getStats:        ()         => AdminAPI.get('/admin/stats'),
  getUsers:        ()         => AdminAPI.get('/admin/users'),
  getOrders:       (params)   => AdminAPI.get('/admin/orders', { params }),
  getOrderDetail:  (id)       => AdminAPI.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, status) => AdminAPI.put(`/admin/orders/${id}/status`, { status }),
};

// ── Wishlist ──────────────────────────────────────────────
export const wishlistService = {
  get:    ()     => API.get('/wishlist'),
  toggle: (pid)  => API.post('/wishlist/toggle', { product_id: pid }),
};
