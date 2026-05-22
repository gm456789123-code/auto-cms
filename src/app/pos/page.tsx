"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UtensilsCrossed, Plus, Settings, RefreshCw } from "lucide-react"
import { Table, TableStatus, POSSettings } from "@/types/pos"
import { loadPackages } from "@/lib/packageStore"
import { loadTables, saveTables, addTable, deleteTable } from "@/lib/tableStore"
import TableCard from "@/components/pos/TableCard"
import OpenTableModal from "@/components/pos/OpenTableModal"
import TableTimer from "@/components/pos/TableTimer"
import { useNotification } from "@/context/NotificationContext"

const FILTER_TABS: { label: string; value: TableStatus | "all" }[] = [
  { label: "ทั้งหมด",   value: "all" },
  { label: "ว่าง",       value: "available" },
  { label: "มีลูกค้า",   value: "occupied" },
  { label: "รอชำระ",     value: "billing" },
]

const DEFAULT_SETTINGS: POSSettings = {
  timeLimitEnabled: true,
  warningMinutes: 15,
  autoCloseEnabled: false,
}

export default function POSPage() {
  const router = useRouter()
  const { toast, addNotification } = useNotification()
  const [tables, setTables] = useState<Table[]>([])
  const [packages, setPackages] = useState(() => loadPackages())
  const [filter, setFilter]       = useState<TableStatus | "all">("all")
  const [openModal, setOpenModal] = useState<Table | null>(null)
  const [settings] = useState<POSSettings>(DEFAULT_SETTINGS)

  useEffect(() => {
    setTables(loadTables())
    setPackages(loadPackages())
  }, [])

  const filtered = filter === "all" ? tables : tables.filter(t => t.status === filter)
  const counts = {
    all:       tables.length,
    available: tables.filter(t => t.status === "available").length,
    occupied:  tables.filter(t => t.status === "occupied").length,
    billing:   tables.filter(t => t.status === "billing").length,
  }

  function handleTableClick(table: Table) {
    if (table.status === "available") {
      setOpenModal(table)
    } else {
      router.push(`/pos/table/${table.id}`)
    }
  }

  function handleAddTable() {
    setTables(prev => addTable(prev))
    toast.success("เพิ่มโต๊ะใหม่แล้ว")
  }

  function handleDeleteTable(table: Table) {
    if (!confirm(`ลบโต๊ะ ${table.number} ออกจากระบบ?`)) return
    setTables(prev => deleteTable(prev, table.id))
    toast.success(`ลบโต๊ะ ${table.number} แล้ว`)
  }

  function handleOpenTable(tableId: number, packageId: string, people: number) {
    const openedAt = new Date().toISOString()
    const tableNumber = openModal?.number ?? tableId
    const token = btoa(JSON.stringify({ id: tableId, number: tableNumber, packageId, people, openedAt, nonce: crypto.randomUUID() }))
    setTables(prev => {
      const updated = prev.map(t =>
        t.id === tableId
          ? { ...t, status: "occupied" as TableStatus, people, packageId, openedAt, orders: [], token }
          : t
      )
      saveTables(updated)
      return updated
    })
    const pkg = packages.find(p => p.id === packageId)
    toast.success(`เปิดโต๊ะ ${openModal?.number} — ${pkg?.name ?? ""} ${people} คน`)
    addNotification({ type: "order", title: "เปิดโต๊ะใหม่", message: `โต๊ะ ${openModal?.number} — ${pkg?.name ?? ""} × ${people} คน` })
    setOpenModal(null)
  }

  function handleTimeUp(tableNumber: number) {
    toast.warning(`โต๊ะ ${tableNumber} หมดเวลาแล้ว!`)
    addNotification({ type: "order", title: `โต๊ะ ${tableNumber} หมดเวลา`, message: "กรุณาแจ้งลูกค้าและคิดเงิน" })
  }

  function handleTimeWarning(tableNumber: number, remaining: number) {
    toast.info(`โต๊ะ ${tableNumber} เหลือเวลาอีก ${remaining} นาที`)
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cms-bg)", padding: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: 42, height: 42,
            background: "linear-gradient(135deg, var(--cms-accent) 0%, #8b5cf6 100%)",
            borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <UtensilsCrossed size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0 }}>ร้านบุฟเฟ่ — POS</h1>
            <p style={{ fontSize: "0.78rem", color: "var(--cms-text-secondary)", margin: 0 }}>คลิกโต๊ะว่างเพื่อเปิด • คลิกโต๊ะที่มีลูกค้าเพื่อจัดการ</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <button onClick={() => router.push("/pos/settings")} style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            background: "var(--cms-card-bg)", border: "1px solid var(--cms-border)",
            borderRadius: "10px", padding: "0.5rem 0.9rem",
            color: "var(--cms-text-secondary)", cursor: "pointer", fontSize: "0.85rem",
          }}>
            <Settings size={15} /> ตั้งค่า
          </button>
          <button
            onClick={() => { setTables(loadTables()); setPackages(loadPackages()) }}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              background: "var(--cms-card-bg)", border: "1px solid var(--cms-border)",
              borderRadius: "10px", padding: "0.5rem 0.9rem",
              color: "var(--cms-text-secondary)", cursor: "pointer", fontSize: "0.85rem",
            }}>
            <RefreshCw size={15} /> รีเฟรช
          </button>
          <button onClick={handleAddTable} className="cms-button-primary" style={{ gap: "0.4rem" }}>
            <Plus size={16} /> เพิ่มโต๊ะ
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.9rem", marginBottom: "1.5rem" }}>
        {[
          { label: "โต๊ะทั้งหมด", value: counts.all,       color: "var(--cms-accent)" },
          { label: "ว่าง",         value: counts.available, color: "#10b981" },
          { label: "มีลูกค้า",     value: counts.occupied,  color: "var(--cms-accent)" },
          { label: "รอชำระ",       value: counts.billing,   color: "#f59e0b" },
        ].map(s => (
          <div key={s.label} className="cms-card" style={{ textAlign: "center", padding: "0.9rem" }}>
            <div style={{ fontSize: "1.7rem", fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--cms-text-secondary)", marginTop: "0.2rem" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {FILTER_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            style={{
              padding: "0.4rem 1rem", borderRadius: "20px", border: "1px solid",
              fontSize: "0.83rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
              background:   filter === tab.value ? "var(--cms-accent)" : "var(--cms-card-bg)",
              borderColor:  filter === tab.value ? "var(--cms-accent)" : "var(--cms-border)",
              color:        filter === tab.value ? "white" : "var(--cms-text-secondary)",
            }}
          >
            {tab.label} ({counts[tab.value]})
          </button>
        ))}
      </div>

      {/* Table Grid */}
      {tables.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--cms-text-secondary)" }}>
          <UtensilsCrossed size={48} style={{ marginBottom: "1rem", opacity: 0.3 }} />
          <p style={{ fontWeight: 600 }}>ยังไม่มีโต๊ะ กด "เพิ่มโต๊ะ" เพื่อเริ่มต้น</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: "1rem" }}>
          {filtered.map(table => {
            const pkg = table.packageId ? packages.find(p => p.id === table.packageId) : null
            return (
              <div key={table.id}>
                <TableCard
                  table={table}
                  onClick={handleTableClick}
                  onDelete={handleDeleteTable}
                />
                {table.status !== "available" && table.openedAt && pkg && (
                  <div style={{ marginTop: "0.4rem" }}>
                    <TableTimer
                      openedAt={table.openedAt}
                      timeLimitMinutes={pkg.timeLimitMinutes}
                      timeLimitEnabled={settings.timeLimitEnabled}
                      warningMinutes={settings.warningMinutes}
                      onTimeUp={() => handleTimeUp(table.number)}
                      onWarning={() => handleTimeWarning(table.number, settings.warningMinutes)}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Open Table Modal */}
      {openModal && (
        <OpenTableModal
          tableNumber={openModal.number}
          onConfirm={(pkgId, people) => handleOpenTable(openModal.id, pkgId, people)}
          onClose={() => setOpenModal(null)}
        />
      )}
    </div>
  )
}
