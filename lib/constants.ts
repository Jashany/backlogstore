export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  PRODUCT: (id: string) => `/product/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  ACCOUNT: '/account',
  ORDERS: '/account/orders',
  WISHLIST: '/wishlist',
  LOGIN: '/login',
  REGISTER: '/register',
} as const

export const COOKIE_NAMES = {
  CART: 'cart',
  WISHLIST: 'wishlist',
  TOKEN: 'token',
} as const

export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  CART: 'cart',
  USER: 'user',
  ORDERS: 'orders',
} as const
