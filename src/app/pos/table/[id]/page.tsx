"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Plus, Minus, Trash2, Receipt, QrCode } from "lucide-react"
import { Table, Package, OrderItem, TableOrder, POSSettings } from "@/types/pos"
import { loadTables, saveTables } from "@/lib/tableStore"
import { loadPackages } from "@/lib/packageStore"
import TableTimer from "@/components/pos/TableTimer"
import QRCodeModal from "@/components/pos/QRCodeModal"
import { useNotification } from "@/context/NotificationContext"

const DEFAULT_SETTINGS: POSSettings = {
  timeLimitEnabled: true,
  warningMinutes: 15,
  autoCloseEnabled: false,
}

export default function TableDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const { toast, addNotification } = useNotification()
  const [settings] = useState<POSSettings>(DEFAULT_SETTINGS)
  const [table, setTable]       = useState<Table | null>(null)
  const [pkg, setPkg]           = useState<Package | null>(null)
  const [activeTab, setActiveTab]   = useState<"included" | "extra">("included")
  const [billTab, setBillTab]       = useState<"current" | "sent">("current")
  const [orders, setOrders]         = useState<OrderItem[]>([])
  const [note, setNote]             = useState("")
  const [sentOrders, setSentOrders] = useState<TableOrder[]>([])
  const [showQR, setShowQR]         = useState(false)
  const [tableToken, setTableToken] = useState<string | undefined>()

  useEffect(() => {
    const tables   = loadTables()
    const packages = loadPackages()
    const t = tables.find(tbl => tbl.id === Number(id))
    if (!t) { router.push("/pos"); return }

    const foundPkg = packages.find(p => p.id === t.packageId) ?? null
    setTable(t)
    setPkg(foundPkg)

    const isValidPayload = (tok: string) => {
      try { JSON.parse(atob(tok)); return true } catch { return false }
    }
    if (t.token && isValidPayload(t.token)) {
      setTableToken(t.token)
    } else {
      const newToken = btoa(JSON.stringify({ id: t.id, number: t.number, packageId: t.packageId ?? "", people: t.people ?? 0, openedAt: t.openedAt ?? new Date().toISOString(), nonce: crypto.randomUUID() }))
      saveTables(tables.map(tbl => tbl.id === t.id ? { ...tbl, token: newToken } : tbl))
      setTableToken(newToken)
    }
  }, [id, router])

  const tableNumber = table?.number ?? Number(id)
  const includedItems = pkg?.menuItems.filter(i => !i.isExtra) ?? []
  const extraItems    = pkg?.menuItems.filter(i => i.isExtra)  ?? []
  const displayItems  = activeTab === "included" ? includedItems : extraItems

  function addItem(itemId: string, name: string, price: number, isExtra: boolean) {
    setOrders(prev => {
      const ex = prev.find(o => o.menuItemId === itemId)
      if (ex) return prev.map(o => o.menuItemId === itemId ? { ...o, qty: o.qty + 1 } : o)
      return [...prev, { menuItemId: itemId, name, price, qty: 1, isExtra }]
    })
  }

  function changeQty(menuItemId: string, delta: number) {
    setOrders(prev => prev.map(o => o.menuItemId === menuItemId ? { ...o, qty: o.qty + delta } : o).filter(o => o.qty > 0))
  }

  function sendOrder() {
    if (orders.length === 0) return
    const order: TableOrder = {
      id: Math.random().toString(36).slice(2),
      items: [...orders],
      note,
      createdAt: new Date().toISOString(),
      status: "pending",
    }
    setSentOrders(prev => [...prev, order])
    toast.success(`ส่งออเดอร์ ${orders.length} รายการแล้ว`)
    addNotification({ type: "order", title: `ออเดอร์ส่งแล้ว โต๊ะ ${tableNumber}`, message: `${orders.length} รายการ` })
    setOrders([])
    setNote("")
  }

  const buffetBase    = (pkg?.price ?? 0) * (table?.people ?? 0)
  const extrasTotal   = sentOrders.flatMap(o => o.items).filter(i => i.isExtra).reduce((s, i) => s + i.price * i.qty, 0)
  const pendingExtras = orders.filter(o => o.isExtra).reduce((s, o) => s + o.price * o.qty, 0)
  const grandTotal    = buffetBase + extrasTotal + pendingExtras

  if (!table || !pkg) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cms-bg)" }}>
        <div style={{ width: 36, height: 36, border: "3px solid var(--cms-border)", borderTopColor: "var(--cms-accent)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cms-bg)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        background: "var(--cms-card-bg)", borderBottom: "1px solid var(--cms-border)",
        padding: "0.9rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap",
      }}>
        <button onClick={() => router.push("/pos")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cms-text-secondary)", display: "flex" }}>
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: "1.1rem", margin: 0 }}>โต๊ะ {tableNumber}</h1>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginTop: "0.2rem" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--cms-text-secondary)" }}>{table.people} คน</span>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, background: pkg.gradient, color: "white", borderRadius: "6px", padding: "2px 7px" }}>{pkg.name}</span>
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
          {table.openedAt && (
            <TableTimer
              openedAt={table.openedAt}
              timeLimitMinutes={pkg.timeLimitMinutes}
              timeLimitEnabled={settings.timeLimitEnabled}
              warningMinutes={settings.warningMinutes}
              onTimeUp={() => toast.warning(`โต๊ะ ${tableNumber} หมดเวลาแล้ว!`)}
              onWarning={() => toast.info(`โต๊ะ ${tableNumber} เหลือเวลาอีก ${settings.warningMinutes} นาที`)}
            />
          )}
          <button
            onClick={() => setShowQR(true)}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              background: "var(--cms-accent-soft)", border: "1px solid var(--cms-accent)",
              color: "var(--cms-accent)", borderRadius: "10px", padding: "0.4rem 0.9rem",
              fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
            }}
          >
            <QrCode size={14} /> QR โต๊ะ
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left — Menu */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: "0.4rem", padding: "0.9rem 1.25rem", borderBottom: "1px solid var(--cms-border)", background: "var(--cms-card-bg)" }}>
            {([["included", `รายการรวม (${includedItems.length})`], ["extra", `รายการพิเศษ (${extraItems.length})`]] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setActiveTab(val)}
                style={{
                  padding: "0.35rem 0.9rem", borderRadius: "20px", border: "1px solid",
                  fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                  background: activeTab === val ? "var(--cms-accent)" : "transparent",
                  borderColor: activeTab === val ? "var(--cms-accent)" : "var(--cms-border)",
                  color: activeTab === val ? "white" : "var(--cms-text-secondary)",
                }}
              >{label}</button>
            ))}
          </div>

          {/* Menu Items */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem" }}>
              {displayItems.map(item => {
                const inOrder = orders.find(o => o.menuItemId === item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => addItem(item.id, item.name, item.extraPrice, item.isExtra)}
                    style={{
                      background: "var(--cms-card-bg)",
                      border: `1.5px solid ${inOrder ? "var(--cms-accent)" : "var(--cms-border)"}`,
                      borderRadius: "12px", padding: "0.9rem",
                      cursor: "pointer", textAlign: "left", transition: "all 0.15s", position: "relative",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    {inOrder && (
                      <span style={{
                        position: "absolute", top: 6, right: 6,
                        background: "var(--cms-accent)", color: "white",
                        borderRadius: "50%", width: 20, height: 20,
                        fontSize: "0.7rem", fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{inOrder.qty}</span>
                    )}
                    <div style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>{item.emoji}</div>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{item.name}</div>
                    <div style={{ fontSize: "0.75rem", marginTop: "0.2rem", color: item.isExtra ? "#f59e0b" : "#10b981", fontWeight: 600 }}>
                      {item.isExtra ? `+฿${item.extraPrice}` : "รวมในแพ็ค"}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Order bar */}
          {orders.length > 0 && (
            <div style={{ borderTop: "1px solid var(--cms-border)", padding: "0.9rem 1.25rem", background: "var(--cms-card-bg)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ flex: 1, display: "flex", gap: "0.5rem", overflowX: "auto" }}>
                {orders.map(o => (
                  <div key={o.menuItemId} style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "var(--cms-bg)", borderRadius: "8px", padding: "0.3rem 0.6rem", whiteSpace: "nowrap", fontSize: "0.8rem" }}>
                    <button onClick={() => changeQty(o.menuItemId, -1)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cms-text-secondary)", padding: 0 }}><Minus size={11} /></button>
                    <span style={{ fontWeight: 600 }}>{o.name} ×{o.qty}</span>
                    <button onClick={() => changeQty(o.menuItemId, 1)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cms-accent)", padding: 0 }}><Plus size={11} /></button>
                  </div>
                ))}
              </div>
              <button onClick={sendOrder} className="cms-button-primary" style={{ whiteSpace: "nowrap", padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
                ส่งออเดอร์ ({orders.length})
              </button>
            </div>
          )}
        </div>

        {/* Right — Bill */}
        <div style={{ width: 300, borderLeft: "1px solid var(--cms-border)", background: "var(--cms-card-bg)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", borderBottom: "1px solid var(--cms-border)" }}>
            {(["current", "sent"] as const).map(tab => (
              <button key={tab} onClick={() => setBillTab(tab)} style={{
                flex: 1, padding: "0.75rem", border: "none", background: "none", cursor: "pointer",
                fontWeight: 600, fontSize: "0.82rem",
                borderBottom: billTab === tab ? "2px solid var(--cms-accent)" : "2px solid transparent",
                color: billTab === tab ? "var(--cms-accent)" : "var(--cms-text-secondary)",
              }}>
                {tab === "current" ? "ออเดอร์ปัจจุบัน" : `ส่งแล้ว (${sentOrders.length})`}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--cms-border)", fontSize: "0.85rem" }}>
              <span style={{ color: "var(--cms-text-secondary)" }}>{pkg.name} × {table.people} คน</span>
              <span style={{ fontWeight: 600 }}>฿{buffetBase.toLocaleString()}</span>
            </div>

            {billTab === "current" && orders.map(o => (
              <div key={o.menuItemId} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0", borderBottom: "1px dashed var(--cms-border)", fontSize: "0.82rem" }}>
                <span style={{ flex: 1 }}>{o.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                  <button onClick={() => changeQty(o.menuItemId, -1)} style={{ background: "none", border: "1px solid var(--cms-border)", borderRadius: "5px", width: 22, height: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus size={11} /></button>
                  <span style={{ width: 18, textAlign: "center", fontWeight: 600 }}>{o.qty}</span>
                  <button onClick={() => changeQty(o.menuItemId, 1)} style={{ background: "none", border: "1px solid var(--cms-border)", borderRadius: "5px", width: 22, height: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={11} /></button>
                </div>
                <span style={{ width: 52, textAlign: "right", fontWeight: 600, color: o.isExtra ? "#f59e0b" : "var(--cms-text-secondary)", fontSize: "0.78rem" }}>
                  {o.isExtra ? `฿${(o.price * o.qty).toLocaleString()}` : "ฟรี"}
                </span>
                <button onClick={() => setOrders(prev => prev.filter(x => x.menuItemId !== o.menuItemId))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cms-danger)", padding: 0 }}><Trash2 size={13} /></button>
              </div>
            ))}

            {billTab === "sent" && sentOrders.map(order => (
              <div key={order.id} style={{ marginBottom: "0.75rem" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--cms-text-secondary)", marginBottom: "0.3rem" }}>
                  {new Date(order.createdAt).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}
                  <span style={{ marginLeft: "0.5rem", background: "#10b98120", color: "#10b981", borderRadius: "4px", padding: "1px 6px", fontWeight: 600 }}>ส่งแล้ว</span>
                </div>
                {order.items.map(i => (
                  <div key={i.menuItemId} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", padding: "0.2rem 0" }}>
                    <span>{i.name} ×{i.qty}</span>
                    <span style={{ color: i.isExtra ? "#f59e0b" : "var(--cms-text-secondary)" }}>
                      {i.isExtra ? `฿${(i.price * i.qty).toLocaleString()}` : "ฟรี"}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ padding: "1rem", borderTop: "1px solid var(--cms-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", fontSize: "0.82rem" }}>
              <span style={{ color: "var(--cms-text-secondary)" }}>ค่าอาหารพิเศษ</span>
              <span>฿{(extrasTotal + pendingExtras).toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontWeight: 700 }}>รวมทั้งหมด</span>
              <span style={{ fontWeight: 800, fontSize: "1.15rem", color: "var(--cms-accent)" }}>฿{grandTotal.toLocaleString()}</span>
            </div>
            <button className="cms-button-primary" style={{ width: "100%", justifyContent: "center", padding: "0.7rem" }}>
              <Receipt size={17} /> ชำระเงิน
            </button>
          </div>
        </div>
      </div>

      {showQR && (
        <QRCodeModal
          tableNumber={tableNumber}
          tableId={id as string}
          token={tableToken}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  )
}
