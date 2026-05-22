"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Pencil, Trash2, Clock, UtensilsCrossed, Package } from "lucide-react"
import { Package as PkgType } from "@/types/pos"
import { loadPackages, savePackages } from "@/lib/packageStore"
import PackageModal from "@/components/pos/PackageModal"
import { useNotification } from "@/context/NotificationContext"

export default function PackagesPage() {
  const router = useRouter()
  const { toast } = useNotification()
  const [packages, setPackages] = useState<PkgType[]>([])
  const [modal, setModal] = useState<{ open: boolean; pkg?: PkgType }>({ open: false })

  useEffect(() => {
    setPackages(loadPackages())
  }, [])

  function handleSave(pkg: PkgType) {
    setPackages(prev => {
      const exists = prev.some(p => p.id === pkg.id)
      const updated = exists ? prev.map(p => p.id === pkg.id ? pkg : p) : [...prev, pkg]
      savePackages(updated)
      return updated
    })
    toast.success(modal.pkg ? "แก้ไขแพ็คเกจแล้ว" : "เพิ่มแพ็คเกจใหม่แล้ว")
    setModal({ open: false })
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`ลบ "${name}" ออกจากระบบ?`)) return
    setPackages(prev => {
      const updated = prev.filter(p => p.id !== id)
      savePackages(updated)
      return updated
    })
    toast.success(`ลบ ${name} แล้ว`)
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cms-bg)", padding: "1.5rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
            <button onClick={() => router.push("/pos/settings")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cms-text-secondary)", display: "flex" }}>
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 style={{ fontWeight: 800, fontSize: "1.2rem", margin: 0 }}>จัดการแพ็คเกจ</h1>
              <p style={{ fontSize: "0.78rem", color: "var(--cms-text-secondary)", margin: 0 }}>{packages.length} แพ็คเกจ</p>
            </div>
          </div>
          <button onClick={() => setModal({ open: true })} className="cms-button-primary">
            <Plus size={16} /> เพิ่มแพ็คเกจ
          </button>
        </div>

        {/* Package Cards */}
        {packages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--cms-text-secondary)" }}>
            <Package size={48} style={{ marginBottom: "1rem", opacity: 0.3 }} />
            <p style={{ fontWeight: 600 }}>ยังไม่มีแพ็คเกจ กด "เพิ่มแพ็คเกจ" เพื่อเริ่มต้น</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {packages.map(pkg => (
              <div key={pkg.id} className="cms-card" style={{ padding: "0", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "stretch" }}>
                  {/* Color bar / image */}
                  <div style={{
                    width: 90, flexShrink: 0, overflow: "hidden",
                    background: pkg.gradient, position: "relative",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: "0.3rem", padding: pkg.image ? 0 : "1rem 0",
                  }}>
                    {pkg.image ? (
                      <img src={pkg.image} alt={pkg.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 80 }} />
                    ) : (
                      <>
                        <UtensilsCrossed size={20} color="rgba(255,255,255,0.9)" />
                        <span style={{ color: "white", fontSize: "0.65rem", fontWeight: 800, textAlign: "center", lineHeight: 1.2 }}>
                          {pkg.name.replace("แพ็คเกจ ", "")}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                      <span style={{ fontWeight: 800, fontSize: "1rem" }}>{pkg.name}</span>
                      {pkg.badge && (
                        <span style={{
                          fontSize: "0.65rem", fontWeight: 700,
                          background: pkg.gradient, color: "white",
                          borderRadius: "6px", padding: "2px 7px",
                        }}>{pkg.badge}</span>
                      )}
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "var(--cms-text-secondary)", margin: "0 0 0.75rem 0" }}>{pkg.description}</p>

                    <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: pkg.color }}>฿{pkg.price}/คน</span>
                      <span style={{ fontSize: "0.82rem", color: "var(--cms-text-secondary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <Clock size={13} /> {pkg.timeLimitMinutes} นาที
                      </span>
                      <span style={{ fontSize: "0.82rem", color: "var(--cms-text-secondary)" }}>
                        {pkg.menuItems.filter(i => !i.isExtra).length} รายการรวม •{" "}
                        {pkg.menuItems.filter(i => i.isExtra).length} รายการพิเศษ
                      </span>
                    </div>

                    {/* Menu preview */}
                    <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                      {pkg.menuItems.slice(0, 10).map(item => (
                        <span key={item.id} style={{
                          display: "inline-flex", alignItems: "center", gap: "0.25rem",
                          fontSize: "0.72rem", padding: "2px 8px",
                          borderRadius: "6px",
                          background: item.isExtra ? "rgba(245,158,11,0.1)" : "var(--cms-accent-soft)",
                          color: item.isExtra ? "#f59e0b" : "var(--cms-accent)",
                          border: `1px solid ${item.isExtra ? "#f59e0b44" : "var(--cms-accent)44"}`,
                        }}>
                          {item.emoji} {item.name}
                          {item.isExtra && ` +฿${item.extraPrice}`}
                        </span>
                      ))}
                      {pkg.menuItems.length > 10 && (
                        <span style={{ fontSize: "0.72rem", color: "var(--cms-text-secondary)", alignSelf: "center" }}>
                          +{pkg.menuItems.length - 10} รายการ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "1rem", justifyContent: "center", borderLeft: "1px solid var(--cms-border)", flexShrink: 0 }}>
                    <button
                      onClick={() => setModal({ open: true, pkg })}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.4rem",
                        padding: "0.45rem 0.85rem", borderRadius: "8px",
                        border: "1px solid var(--cms-border)", background: "none",
                        cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
                        color: "var(--cms-text-secondary)",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--cms-accent)"; e.currentTarget.style.color = "var(--cms-accent)" }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--cms-border)"; e.currentTarget.style.color = "var(--cms-text-secondary)" }}
                    >
                      <Pencil size={14} /> แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id, pkg.name)}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.4rem",
                        padding: "0.45rem 0.85rem", borderRadius: "8px",
                        border: "1px solid var(--cms-border)", background: "none",
                        cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
                        color: "var(--cms-text-secondary)",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--cms-danger)"; e.currentTarget.style.color = "var(--cms-danger)" }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--cms-border)"; e.currentTarget.style.color = "var(--cms-text-secondary)" }}
                    >
                      <Trash2 size={14} /> ลบ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal.open && (
        <PackageModal
          initial={modal.pkg}
          onSave={handleSave}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  )
}
