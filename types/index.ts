export interface Product {
  id: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  category: string
  images: ProductImage[]
  variants?: ProductVariant[]
  inStock: boolean
  featured?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductImage {
  id: string
  url: string
  altText?: string
}

export interface ProductVariant {
  id: string
  name: string
  value: string
  price?: number
  inStock: boolean
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  variantId?: string
}

export interface User {
  id: number
  email: string
  firstName: string | null
  lastName: string | null
  createdAt?: string
}

// Legacy User type for backward compatibility
export interface LegacyUser {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface Address {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: Address
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
}
