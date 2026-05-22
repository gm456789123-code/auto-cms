"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Send, UtensilsCrossed, CheckCircle, ShieldAlert } from "lucide-react"
import { loadPackages } from "@/lib/packageStore"
import { PackageMenuItem, Package, Table } from "@/types/pos"

interface CartItem extends PackageMenuItem {
  qty: number
}

type PageState = "loading" | "invalid_token" | "table_closed" | "ready"

export default function CustomerMenuPage() {
  const { tableId } = useParams()

  const [pageState, setPageState] = useState<PageState>("loading")
  const [table, setTable]   = useState<Table | null>(null)
  const [pkg, setPkg]       = useState<Package | null>(null)
  const [cart, setCart]     = useState<CartItem[]>([])
  const [note, setNote]     = useState("")
  const [sent, setSent]     = useState(false)
  const [activeTab, setActiveTab] = useState<"included" | "extra">("included")

  useEffect(() => {
    const tokenStr = new URLSearchParams(window.location.search).get("t") ?? ""
    if (!tokenStr) { setPageState("invalid_token"); return }

    try {
      const decoded = JSON.parse(atob(tokenStr)) as {
        id: number; number: number; packageId: string
        people: number; openedAt: string; nonce: string
      }

      if (String(decoded.id) !== String(tableId)) {
        setPageState("invalid_token")
        return
      }

      const packages = loadPackages()
      const foundPkg = packages.find(p => p.id === decoded.packageId) ?? null

      setTable({ id: decoded.id, number: decoded.number, status: "occupied", packageId: decoded.packageId, people: decoded.people, openedAt: decoded.openedAt, token: tokenStr })
      setPkg(foundPkg)
      setPageState(foundPkg ? "ready" : "table_closed")
    } catch {
      setPageState("invalid_token")
    }
  }, [tableId])

  const includedItems = pkg?.menuItems.filter(i => !i.isExtra) ?? []
  const extraItems    = pkg?.menuItems.filter(i => i.isExtra)  ?? []
  const displayItems  = activeTab === "included" ? includedItems : extraItems
  const totalExtra    = cart.filter(c => c.isExtra).reduce((s, c) => s + c.extraPrice * c.qty, 0)
  const cartCount     = cart.reduce((s, c) => s + c.qty, 0)

  function addToCart(item: PackageMenuItem) {
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id)
      if (ex) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { ...item, qty: 1 }]
    })
  }

  function changeQty(id: string, delta: number) {
    setCart(prev =>
      prev.map(c => c.id === id ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0)
    )
  }

  function sendOrder() {
    if (cart.length === 0) return
    setSent(true)
    setCart([])
    setNote("")
    setTimeout(() => setSent(false), 4000)
  }

  if (pageState === "loading") {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #e2e8f0", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (pageState === "invalid_token") {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: 320 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
            <ShieldAlert size={34} color="#ef4444" />
          </div>
          <h2 style={{ fontWeight: 800, fontSize: "1.15rem", color: "#1e293b", marginBottom: "0.6rem" }}>ลิงก์นี้ไม่ถูกต้อง</h2>
          <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.6 }}>
            กรุณาสแกน QR Code จากโต๊ะของคุณอีกครั้ง<br />หรือติดต่อพนักงาน
          </p>
        </div>
      </div>
    )
  }

  if (pageState === "table_closed") {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "2rem" }}>
        <div style={{ textAlign: "center" }}>
          <UtensilsCrossed size={48} style={{ marginBottom: "1rem", color: "#94a3b8" }} />
          <h2 style={{ fontWeight: 800, fontSize: "1.2rem", color: "#1e293b", marginBottom: "0.5rem" }}>โต๊ะนี้ยังไม่ได้เปิด</h2>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>กรุณาติดต่อพนักงาน</p>
        </div>
      </div>
    )
  }

  if (!pkg || !table) return null

  return (
    <div style={{ minHeight: "100dvh", background: "#f8fafc", paddingBottom: cart.length > 0 ? "90px" : "1.5rem" }}>
      {/* Header */}
      <div style={{ background: pkg.gradient, padding: "1.5rem 1.25rem 2.5rem" }}>
        {pkg.image && (
          <img
            src={pkg.image}
            alt={pkg.name}
            style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: "14px", marginBottom: "1rem", display: "block" }}
          />
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 42, height: 42, borderRadius: "12px", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <UtensilsCrossed size={22} color="white" />
          </div>
          <div>
            <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.15rem", margin: 0 }}>{pkg.name}</h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem", margin: 0 }}>โต๊ะ {table.number} • {table.people} คน</p>
          </div>
          {pkg.badge && (
            <span style={{ marginLeft: "auto", background: "rgba(255,255,255,0.25)", color: "white", borderRadius: "8px", padding: "3px 10px", fontSize: "0.72rem", fontWeight: 700 }}>
              {pkg.badge}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ margin: "-1rem 1rem 0", background: "white", borderRadius: "14px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", overflow: "hidden", display: "flex" }}>
        {([["included", `รายการรวม (${includedItems.length})`], ["extra", `รายการพิเศษ (${extraItems.length})`]] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setActiveTab(val)}
            style={{
              flex: 1, padding: "0.85rem", border: "none", cursor: "pointer",
              fontWeight: 700, fontSize: "0.82rem",
              borderBottom: activeTab === val ? `3px solid ${pkg.color}` : "3px solid transparent",
              color: activeTab === val ? pkg.color : "#64748b",
              background: "white", transition: "all 0.15s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Menu grid */}
      <div style={{ padding: "1.25rem 1rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.75rem" }}>
        {displayItems.map(item => {
          const inCart = cart.find(c => c.id === item.id)
          return (
            <div
              key={item.id}
              style={{
                background: "white", borderRadius: "14px",
                boxShadow: inCart ? `0 0 0 2px ${pkg.color}` : "0 2px 8px rgba(0,0,0,0.07)",
                overflow: "hidden", cursor: "pointer", transition: "all 0.15s",
              }}
              onClick={() => addToCart(item)}
            >
              <div style={{ padding: "1rem", textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.4rem" }}>{item.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#1e293b" }}>{item.name}</div>
                <div style={{ fontSize: "0.75rem", marginTop: "0.3rem", fontWeight: 600, color: item.isExtra ? "#f59e0b" : "#10b981" }}>
                  {item.isExtra ? `+฿${item.extraPrice}` : "ฟรี"}
                </div>
              </div>
              {inCart && (
                <div style={{ background: pkg.color, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.4rem 0.75rem" }}>
                  <button onClick={e => { e.stopPropagation(); changeQty(item.id, -1) }}
                    style={{ background: "rgba(255,255,255,0.25)", border: "none", color: "white", width: 24, height: 24, borderRadius: "6px", cursor: "pointer", fontWeight: 700, fontSize: "1rem" }}>−</button>
                  <span style={{ color: "white", fontWeight: 800, fontSize: "0.9rem" }}>{inCart.qty}</span>
                  <button onClick={e => { e.stopPropagation(); changeQty(item.id, 1) }}
                    style={{ background: "rgba(255,255,255,0.25)", border: "none", color: "white", width: 24, height: 24, borderRadius: "6px", cursor: "pointer", fontWeight: 700, fontSize: "1rem" }}>+</button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Success banner */}
      {sent && (
        <div style={{
          position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)",
          background: "#10b981", color: "white", borderRadius: "12px",
          padding: "0.75rem 1.5rem", fontWeight: 700, fontSize: "0.9rem",
          display: "flex", alignItems: "center", gap: "0.5rem",
          boxShadow: "0 8px 24px rgba(16,185,129,0.4)", zIndex: 999,
          animation: "slideDown 0.3s ease-out",
        }}>
          <CheckCircle size={18} /> ส่งออเดอร์แล้ว! พนักงานจะนำมาให้ค่ะ
        </div>
      )}

      {/* Cart bar */}
      {cart.length > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "white", borderTop: "1px solid #e2e8f0",
          padding: "0.9rem 1rem", boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
        }}>
          <div style={{ marginBottom: "0.6rem", maxHeight: 80, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {cart.map(c => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#475569" }}>
                <span>{c.emoji} {c.name} ×{c.qty}</span>
                <span style={{ fontWeight: 600, color: c.isExtra ? "#f59e0b" : "#10b981" }}>
                  {c.isExtra ? `฿${c.extraPrice * c.qty}` : "ฟรี"}
                </span>
              </div>
            ))}
          </div>
          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="หมายเหตุ (ไม่ใส่เผ็ด, ไม่ใส่ผัก ฯลฯ)"
            style={{
              width: "100%", padding: "0.5rem 0.75rem", borderRadius: "10px",
              border: "1.5px solid #e2e8f0", fontSize: "0.82rem",
              outline: "none", boxSizing: "border-box", marginBottom: "0.6rem",
              color: "#1e293b", background: "#f8fafc",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#1e293b" }}>{cartCount} รายการ</span>
              {totalExtra > 0 && <span style={{ fontSize: "0.8rem", color: "#f59e0b", fontWeight: 700, marginLeft: "0.5rem" }}>+฿{totalExtra}</span>}
            </div>
            <button
              onClick={sendOrder}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                background: pkg.gradient, color: "white", border: "none",
                borderRadius: "12px", padding: "0.65rem 1.25rem",
                fontWeight: 700, fontSize: "0.88rem", cursor: "pointer",
              }}
            >
              <Send size={15} /> สั่งอาหาร
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
