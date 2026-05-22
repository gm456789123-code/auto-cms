export type TableStatus = "available" | "occupied" | "billing"
export type OrderStatus = "pending" | "confirmed" | "served"

export interface PackageMenuItem {
  id: string
  name: string
  emoji: string
  isExtra: boolean
  extraPrice: number
}

export interface Package {
  id: string
  name: string
  price: number
  timeLimitMinutes: number
  color: string
  gradient: string
  description: string
  badge?: string
  image?: string
  menuItems: PackageMenuItem[]
}

export interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  emoji: string
}

export interface OrderItem {
  menuItemId: string
  name: string
  price: number
  qty: number
  isExtra: boolean
}

export interface TableOrder {
  id: string
  items: OrderItem[]
  note: string
  createdAt: string
  status: OrderStatus
}

export interface Table {
  id: number
  number: number
  status: TableStatus
  people?: number
  openedAt?: string
  packageId?: string
  token?: string
  orders?: TableOrder[]
}

export interface POSSettings {
  timeLimitEnabled: boolean
  warningMinutes: number
  autoCloseEnabled: boolean
}
