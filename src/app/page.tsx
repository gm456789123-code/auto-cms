"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { UtensilsCrossed, ShoppingBasket, Car, Scissors, ChevronRight, TrendingUp, Users, Receipt } from "lucide-react"
import { useNotification } from "@/context/NotificationContext"
import TopBar from "@/components/layout/TopBar"

interface ShopType {
  id: string
  icon: React.ReactNode
  label: string
  description: string
  color: string
  available: boolean
  href: string
  gradient: string
}

const SHOP_TYPES: ShopType[] = [
  {
    id: "buffet",
    icon: <UtensilsCrossed size={30} />,
    label: "ร้านบุฟเฟ่",
    description: "จัดการโต๊ะ สั่งอาหาร คิดเงินตามรอบเวลา",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
    available: true,
    href: "/pos",
  },
  {
    id: "grocery",
    icon: <ShoppingBasket size={30} />,
    label: "ร้านขายของชำ",
    description: "สแกนสินค้า คิดเงิน จัดการสต็อก",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
    available: false,
    href: "/pos/grocery",
  },
  {
    id: "carwash",
    icon: <Car size={30} />,
    label: "ร้านล้างรถ",
    description: "จัดคิว บันทึกบริการ คิดเงินต่อคัน",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
    available: false,
    href: "/pos/carwash",
  },
  {
    id: "salon",
    icon: <Scissors size={30} />,
    label: "ร้านเสริมสวย",
    description: "จองคิว บริการ คิดเงินตามรายการ",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    available: false,
    href: "/pos/salon",
  },
]

const MOCK_STATS = [
  { label: "ยอดขายวันนี้", value: "฿12,480", icon: <TrendingUp size={20} />, color: "#10b981", change: "+8%" },
  { label: "ลูกค้าวันนี้", value: "47 คน", icon: <Users size={20} />, color: "#3b82f6", change: "+12%" },
  { label: "ออเดอร์ทั้งหมด", value: "23 รายการ", icon: <Receipt size={20} />, color: "#8b5cf6", change: "+5%" },
]

export default function HomePage() {
  const router = useRouter()
  const { toast } = useNotification()

  function handleShopSelect(shop: ShopType) {
    if (!shop.available) {
      toast.info(`${shop.label} จะเปิดให้ใช้งานเร็วๆ นี้`)
      return
    }
    toast.success(`กำลังเข้าสู่ ${shop.label}`)
    router.push(shop.href)
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cms-bg)" }}>
      <TopBar />

      <div style={{ maxWidth: "1040px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, var(--cms-accent) 0%, #8b5cf6 100%)",
          borderRadius: "20px",
          padding: "2rem 2.5rem",
          marginBottom: "2rem",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "white", margin: 0 }}>
              ยินดีต้อนรับสู่ Auto CMS 👋
            </h1>
            <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.4rem", fontSize: "0.9rem" }}>
              เลือกประเภทร้านค้าเพื่อเริ่มใช้งานระบบ POS
            </p>
          </div>
          <div style={{
            position: "absolute", right: -30, top: -30,
            width: 180, height: 180,
            background: "rgba(255,255,255,0.06)",
            borderRadius: "50%",
          }} />
          <div style={{
            position: "absolute", right: 60, bottom: -50,
            width: 140, height: 140,
            background: "rgba(255,255,255,0.05)",
            borderRadius: "50%",
          }} />
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {MOCK_STATS.map(s => (
            <div key={s.label} className="cms-card" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.1rem 1.25rem" }}>
              <div style={{
                width: 44, height: 44, borderRadius: "12px",
                background: `${s.color}18`,
                color: s.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800 }}>{s.value}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--cms-text-secondary)" }}>{s.label}</span>
                  <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 600 }}>{s.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shop Types */}
        <div style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--cms-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
            เลือกประเภทร้านค้า
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
          {SHOP_TYPES.map(shop => (
            <div
              key={shop.id}
              onClick={() => handleShopSelect(shop)}
              className="cms-card"
              style={{
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.25s ease",
                opacity: shop.available ? 1 : 0.6,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)"
                e.currentTarget.style.borderColor = shop.color
                e.currentTarget.style.boxShadow = `0 12px 32px ${shop.color}28`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.borderColor = "var(--cms-border)"
                e.currentTarget.style.boxShadow = "var(--cms-shadow)"
              }}
            >
              {!shop.available && (
                <span style={{
                  position: "absolute", top: "0.9rem", right: "0.9rem",
                  fontSize: "0.68rem", fontWeight: 700,
                  background: "var(--cms-border)", color: "var(--cms-text-secondary)",
                  borderRadius: "6px", padding: "2px 8px",
                }}>
                  เร็วๆ นี้
                </span>
              )}

              <div style={{
                width: 56, height: 56,
                borderRadius: "16px",
                background: shop.gradient,
                color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "1.1rem",
                boxShadow: `0 6px 16px ${shop.color}40`,
              }}>
                {shop.icon}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: "1rem", margin: "0 0 0.3rem 0" }}>{shop.label}</h3>
                  <p style={{ color: "var(--cms-text-secondary)", fontSize: "0.82rem", margin: 0, lineHeight: 1.5 }}>
                    {shop.description}
                  </p>
                </div>
                {shop.available && (
                  <div style={{
                    width: 32, height: 32, borderRadius: "10px",
                    background: `${shop.color}18`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginLeft: "0.75rem",
                  }}>
                    <ChevronRight size={18} color={shop.color} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
