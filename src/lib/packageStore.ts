import { Package } from "@/types/pos"

const KEY = "autoshop_packages"

export const DEFAULT_PACKAGES: Package[] = [
  {
    id: "pkg_1",
    name: "แพ็คเกจ 199",
    price: 199,
    timeLimitMinutes: 90,
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
    description: "อาหารทั่วไป ไม่รวมเครื่องดื่ม",
    badge: "ประหยัด",
    menuItems: [
      { id: "i1", name: "หมูย่าง",      emoji: "🥩", isExtra: false, extraPrice: 0 },
      { id: "i2", name: "ไก่ย่าง",      emoji: "🍗", isExtra: false, extraPrice: 0 },
      { id: "i3", name: "กุ้งย่าง",     emoji: "🦐", isExtra: false, extraPrice: 0 },
      { id: "i4", name: "ผักรวม",       emoji: "🥦", isExtra: false, extraPrice: 0 },
      { id: "i5", name: "น้ำเปล่า",     emoji: "💧", isExtra: true,  extraPrice: 15 },
      { id: "i6", name: "โค้ก/เป๊ปซี่", emoji: "🥤", isExtra: true,  extraPrice: 35 },
    ],
  },
  {
    id: "pkg_2",
    name: "แพ็คเกจ 258",
    price: 258,
    timeLimitMinutes: 120,
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
    description: "อาหาร + เครื่องดื่มไม่อัดลม",
    badge: "แนะนำ",
    menuItems: [
      { id: "i1", name: "หมูย่าง",      emoji: "🥩", isExtra: false, extraPrice: 0 },
      { id: "i2", name: "ไก่ย่าง",      emoji: "🍗", isExtra: false, extraPrice: 0 },
      { id: "i3", name: "กุ้งย่าง",     emoji: "🦐", isExtra: false, extraPrice: 0 },
      { id: "i4", name: "ผักรวม",       emoji: "🥦", isExtra: false, extraPrice: 0 },
      { id: "i7", name: "น้ำผลไม้",     emoji: "🧃", isExtra: false, extraPrice: 0 },
      { id: "i8", name: "ชาเขียว",      emoji: "🍵", isExtra: false, extraPrice: 0 },
      { id: "i9", name: "น้ำเปล่า",     emoji: "💧", isExtra: false, extraPrice: 0 },
      { id: "i6", name: "โค้ก/เป๊ปซี่", emoji: "🥤", isExtra: true,  extraPrice: 35 },
      { id: "i10", name: "เบียร์",       emoji: "🍺", isExtra: true,  extraPrice: 65 },
    ],
  },
  {
    id: "pkg_3",
    name: "แพ็คเกจ 358",
    price: 358,
    timeLimitMinutes: 150,
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    description: "อาหาร + เครื่องดื่ม + ของหวาน ไม่จำกัด",
    badge: "พรีเมียม",
    menuItems: [
      { id: "i1",  name: "หมูย่าง",      emoji: "🥩", isExtra: false, extraPrice: 0 },
      { id: "i2",  name: "ไก่ย่าง",      emoji: "🍗", isExtra: false, extraPrice: 0 },
      { id: "i3",  name: "กุ้งย่าง",     emoji: "🦐", isExtra: false, extraPrice: 0 },
      { id: "i11", name: "ปลาหมึกย่าง", emoji: "🦑", isExtra: false, extraPrice: 0 },
      { id: "i4",  name: "ผักรวม",       emoji: "🥦", isExtra: false, extraPrice: 0 },
      { id: "i7",  name: "น้ำผลไม้",     emoji: "🧃", isExtra: false, extraPrice: 0 },
      { id: "i8",  name: "ชาเขียว",      emoji: "🍵", isExtra: false, extraPrice: 0 },
      { id: "i9",  name: "น้ำเปล่า",     emoji: "💧", isExtra: false, extraPrice: 0 },
      { id: "i12", name: "ไอศกรีม",      emoji: "🍦", isExtra: false, extraPrice: 0 },
      { id: "i13", name: "วาฟเฟิล",      emoji: "🧇", isExtra: false, extraPrice: 0 },
      { id: "i6",  name: "โค้ก/เป๊ปซี่", emoji: "🥤", isExtra: true,  extraPrice: 35 },
      { id: "i10", name: "เบียร์",        emoji: "🍺", isExtra: true,  extraPrice: 65 },
    ],
  },
]

export function loadPackages(): Package[] {
  if (typeof window === "undefined") return DEFAULT_PACKAGES
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : DEFAULT_PACKAGES
  } catch {
    return DEFAULT_PACKAGES
  }
}

export function savePackages(packages: Package[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(packages))
}
