"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, Bell, ToggleLeft, ToggleRight, Save, Package, ChevronRight, Wallet } from "lucide-react"
import { loadPackages } from "@/lib/packageStore"
import { POSSettings } from "@/types/pos"
import { loadPaymentSettings, savePaymentSettings, PaymentSettings } from "@/lib/paymentStore"
import { useNotification } from "@/context/NotificationContext"

const PACKAGES = typeof window !== "undefined" ? loadPackages() : []

const DEFAULT: POSSettings = {
  timeLimitEnabled: true,
  warningMinutes: 15,
  autoCloseEnabled: false,
}

export default function POSSettingsPage() {
  const router = useRouter()
  const { toast } = useNotification()
  const [settings, setSettings] = useState<POSSettings>(DEFAULT)
  const [pkgLimits, setPkgLimits] = useState<Record<string, number>>(
    Object.fromEntries(PACKAGES.map(p => [p.id, p.timeLimitMinutes]))
  )
  const [payment, setPayment] = useState<PaymentSettings>({ promptpayId: "", promptpayName: "" })

  useEffect(() => {
    setPayment(loadPaymentSettings())
  }, [])

  function toggle(key: keyof POSSettings) {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function save() {
    savePaymentSettings(payment)
    toast.success("บันทึกการตั้งค่าแล้ว")
    router.push("/pos")
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cms-bg)", padding: "1.5rem" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", marginBottom: "2rem" }}>
          <button onClick={() => router.push("/pos")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cms-text-secondary)", display: "flex" }}>
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: "1.2rem", margin: 0 }}>ตั้งค่าระบบ POS</h1>
            <p style={{ fontSize: "0.8rem", color: "var(--cms-text-secondary)", margin: 0 }}>ร้านบุฟเฟ่ — Time limit & การแจ้งเตือน</p>
          </div>
        </div>

        {/* Packages Link */}
        <div
          className="cms-card"
          onClick={() => router.push("/pos/packages")}
          style={{ marginBottom: "1.25rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--cms-accent)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--cms-border)")}
        >
          <div style={{ width: 36, height: 36, borderRadius: "10px", background: "var(--cms-accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Package size={18} color="var(--cms-accent)" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>จัดการแพ็คเกจ</h3>
            <p style={{ fontSize: "0.78rem", color: "var(--cms-text-secondary)", margin: 0 }}>เพิ่ม แก้ไข ลบแพ็คเกจ และเมนูอาหารแต่ละแพ็ค ({PACKAGES.length} แพ็คเกจ)</p>
          </div>
          <ChevronRight size={18} color="var(--cms-text-secondary)" />
        </div>

        {/* Time Limit Section */}
        <div className="cms-card" style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "10px", background: "var(--cms-accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={18} color="var(--cms-accent)" />
            </div>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>ระบบจำกัดเวลา</h3>
              <p style={{ fontSize: "0.78rem", color: "var(--cms-text-secondary)", margin: 0 }}>นับเวลาและแจ้งเตือนเมื่อใกล้หมด</p>
            </div>
            <button
              onClick={() => toggle("timeLimitEnabled")}
              style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: settings.timeLimitEnabled ? "var(--cms-accent)" : "var(--cms-text-secondary)" }}
            >
              {settings.timeLimitEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>

          {settings.timeLimitEnabled && (
            <>
              {/* Warning Minutes */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.6rem" }}>
                  แจ้งเตือนล่วงหน้ากี่นาที
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {[10, 15, 20, 30].map(min => (
                    <button
                      key={min}
                      onClick={() => setSettings(prev => ({ ...prev, warningMinutes: min }))}
                      style={{
                        padding: "0.4rem 1rem", borderRadius: "20px", border: "1.5px solid",
                        fontSize: "0.83rem", fontWeight: 600, cursor: "pointer",
                        background: settings.warningMinutes === min ? "var(--cms-accent)" : "transparent",
                        borderColor: settings.warningMinutes === min ? "var(--cms-accent)" : "var(--cms-border)",
                        color: settings.warningMinutes === min ? "white" : "var(--cms-text-secondary)",
                      }}
                    >
                      {min} นาที
                    </button>
                  ))}
                </div>
              </div>

              {/* Per-package time limits */}
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.75rem" }}>
                  เวลาจำกัดแต่ละแพ็คเกจ
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {PACKAGES.map(pkg => (
                    <div key={pkg.id} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "8px", background: pkg.gradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "white", fontSize: "0.7rem", fontWeight: 800 }}>{pkg.name.split(" ")[1]}</span>
                      </div>
                      <span style={{ flex: 1, fontWeight: 600, fontSize: "0.88rem" }}>{pkg.name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button onClick={() => setPkgLimits(prev => ({ ...prev, [pkg.id]: Math.max(30, prev[pkg.id] - 15) }))}
                          style={{ width: 28, height: 28, borderRadius: "8px", border: "1px solid var(--cms-border)", background: "none", cursor: "pointer", fontWeight: 700 }}>−</button>
                        <span style={{ minWidth: 60, textAlign: "center", fontWeight: 700, fontSize: "0.9rem" }}>
                          {pkgLimits[pkg.id]} น.
                        </span>
                        <button onClick={() => setPkgLimits(prev => ({ ...prev, [pkg.id]: prev[pkg.id] + 15 }))}
                          style={{ width: 28, height: 28, borderRadius: "8px", border: "1px solid var(--cms-border)", background: "none", cursor: "pointer", fontWeight: 700 }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Auto Close */}
        <div className="cms-card" style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "10px", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bell size={18} color="#ef4444" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>แจ้งเตือนออเดอร์ใหม่</h3>
              <p style={{ fontSize: "0.78rem", color: "var(--cms-text-secondary)", margin: 0 }}>แสดง toast เมื่อลูกค้าสั่งอาหารจาก QR</p>
            </div>
            <button
              onClick={() => toggle("autoCloseEnabled")}
              style={{ background: "none", border: "none", cursor: "pointer", color: settings.autoCloseEnabled ? "var(--cms-accent)" : "var(--cms-text-secondary)" }}
            >
              {settings.autoCloseEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>
        </div>

        {/* PromptPay Settings */}
        <div className="cms-card" style={{ marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "10px", background: "rgba(16,185,129,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Wallet size={18} color="#10b981" />
            </div>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>PromptPay QR</h3>
              <p style={{ fontSize: "0.78rem", color: "var(--cms-text-secondary)", margin: 0 }}>หมายเลขพร้อมเพย์สำหรับรับชำระ</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            <div>
              <label style={{ fontSize: "0.83rem", fontWeight: 600, display: "block", marginBottom: "0.45rem" }}>
                หมายเลขพร้อมเพย์
              </label>
              <input
                type="text"
                value={payment.promptpayId}
                onChange={e => setPayment(prev => ({ ...prev, promptpayId: e.target.value.replace(/\s/g, "") }))}
                placeholder="เบอร์โทร / เลขบัตรประชาชน / เลขบัญชี"
                style={{
                  width: "100%", padding: "0.6rem 0.85rem",
                  borderRadius: "10px", border: "1.5px solid var(--cms-border)",
                  background: "var(--cms-bg)", color: "var(--cms-text-primary)",
                  fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
                }}
                onFocus={e => (e.target.style.borderColor = "var(--cms-accent)")}
                onBlur={e => (e.target.style.borderColor = "var(--cms-border)")}
              />
              <p style={{ fontSize: "0.75rem", color: "var(--cms-text-secondary)", margin: "0.35rem 0 0" }}>
                รองรับ: เบอร์โทร 10 หลัก, เลขบัตร 13 หลัก, หรือเลขบัญชีธนาคาร
              </p>
            </div>
            <div>
              <label style={{ fontSize: "0.83rem", fontWeight: 600, display: "block", marginBottom: "0.45rem" }}>
                ชื่อบัญชี (แสดงบน QR)
              </label>
              <input
                type="text"
                value={payment.promptpayName}
                onChange={e => setPayment(prev => ({ ...prev, promptpayName: e.target.value }))}
                placeholder="ชื่อร้าน / ชื่อเจ้าของบัญชี"
                style={{
                  width: "100%", padding: "0.6rem 0.85rem",
                  borderRadius: "10px", border: "1.5px solid var(--cms-border)",
                  background: "var(--cms-bg)", color: "var(--cms-text-primary)",
                  fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
                }}
                onFocus={e => (e.target.style.borderColor = "var(--cms-accent)")}
                onBlur={e => (e.target.style.borderColor = "var(--cms-border)")}
              />
            </div>
          </div>
        </div>

        <button onClick={save} className="cms-button-primary" style={{ width: "100%", justifyContent: "center", padding: "0.8rem" }}>
          <Save size={17} />
          บันทึกการตั้งค่า
        </button>
      </div>
    </div>
  )
}
