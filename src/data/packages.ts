import { Package, MenuItem } from "@/types/pos"

export const PACKAGES: Package[] = [
  {
    id: "basic",
    name: "แพ็คเกจ A",
    price: 199,
    timeLimitMinutes: 90,
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
    description: "อาหารทั่วไป ไม่รวมเครื่องดื่ม",
    includedCategories: ["อาหาร"],
    badge: "ประหยัด",
  },
  {
    id: "standard",
    name: "แพ็คเกจ B",
    price: 299,
    timeLimitMinutes: 120,
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
    description: "อาหาร + เครื่องดื่มไม่อัดลม",
    includedCategories: ["อาหาร", "เครื่องดื่ม"],
    badge: "แนะนำ",
  },
  {
    id: "premium",
    name: "แพ็คเกจ C",
    price: 399,
    timeLimitMinutes: 150,
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    description: "อาหาร + เครื่องดื่ม + ของหวาน ไม่จำกัด",
    includedCategories: ["อาหาร", "เครื่องดื่ม", "ของหวาน"],
    badge: "พรีเมียม",
  },
]

export const MENU_ITEMS: MenuItem[] = [
  { id: "m1",  name: "หมูย่าง",        price: 0,  category: "อาหาร",      emoji: "🥩" },
  { id: "m2",  name: "ไก่ย่าง",        price: 0,  category: "อาหาร",      emoji: "🍗" },
  { id: "m3",  name: "กุ้งย่าง",       price: 0,  category: "อาหาร",      emoji: "🦐" },
  { id: "m4",  name: "ปลาหมึกย่าง",   price: 0,  category: "อาหาร",      emoji: "🦑" },
  { id: "m5",  name: "ผักรวม",         price: 0,  category: "อาหาร",      emoji: "🥦" },
  { id: "m6",  name: "น้ำเปล่า",       price: 0,  category: "เครื่องดื่ม", emoji: "💧" },
  { id: "m7",  name: "น้ำผลไม้",       price: 0,  category: "เครื่องดื่ม", emoji: "🧃" },
  { id: "m8",  name: "ชาเขียว",        price: 0,  category: "เครื่องดื่ม", emoji: "🍵" },
  { id: "m9",  name: "ไอศกรีม",        price: 0,  category: "ของหวาน",    emoji: "🍦" },
  { id: "m10", name: "วาฟเฟิล",        price: 0,  category: "ของหวาน",    emoji: "🧇" },
  { id: "m11", name: "โค้ก/เป๊ปซี่",   price: 35, category: "พิเศษ",      emoji: "🥤" },
  { id: "m12", name: "เบียร์",          price: 65, category: "พิเศษ",      emoji: "🍺" },
  { id: "m13", name: "น้ำแข็ง (ถัง)",  price: 49, category: "พิเศษ",      emoji: "🧊" },
]
