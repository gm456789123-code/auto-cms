"use client"

import React, { useState, useEffect } from "react"
import { X, Banknote, QrCode, CheckCircle, AlertCircle, Settings } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useRouter } from "next/navigation"
import { loadPaymentSettings } from "@/lib/paymentStore"

interface Props {
  tableNumber: number
  totalAmount: number
  packageName: string
  people: number
  onConfirm: () => void
  onClose: () => void
}

type Tab = "cash" | "qr"

function generatePromptPayPayload(id: string, amount: number): string {
  const sanitized = id.replace(/[-\s]/g, "")

  let accountType: string
  let accountValue: string

  if (/^0\d{9}$/.test(sanitized)) {
    accountType = "01"
    accountValue = "0066" + sanitized.slice(1)
  } else if (/^\d{13}$/.test(sanitized)) {
    accountType = "02"
    accountValue = sanitized
  } else {
    accountType = "03"
    accountValue = sanitized
  }

  const formatField = (id: string, value: string) =>
    id + value.length.toString().padStart(2, "0") + value

  const merchantAccountInfo =
    formatField("00", "A000000677010111") +
    formatField(accountType, accountValue)

  const amountStr = amount.toFixed(2)

  const payload =
    formatField("00", "01") +
    formatField("01", "12") +
    formatField("29", merchantAccountInfo) +
    formatField("53", "764") +
    formatField("54", amountStr) +
    formatField("58", "TH") +
    "6304"

  const crc = crc16(payload)
  return payload + crc.toString(16).toUpperCase().padStart(4, "0")
}

function crc16(data: string): number {
  let crc = 0xffff
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
    }
  }
  return crc & 0xffff
}

const CASH_PRESETS = [20, 50, 100, 500, 1000]

export default function PaymentModal({ tableNumber, totalAmount, packageName, people, onConfirm, onClose }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("cash")
  const [cashReceived, setCashReceived] = useState("")
  const [qrPayload, setQrPayload] = useState("")
  const [promptpayId, setPromptpayId] = useState("")
  const [promptpayName, setPromptpayName] = useState("")
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    const s = loadPaymentSettings()
    setPromptpayId(s.promptpayId)
    setPromptpayName(s.promptpayName)
    if (s.promptpayId) {
      setQrPayload(generatePromptPayPayload(s.promptpayId, totalAmount))
    }
  }, [totalAmount])

  const cashNum   = parseFloat(cashReceived) || 0
  const change    = cashNum - totalAmount
  const cashValid = cashNum >= totalAmount

  function handleConfirm() {
    setConfirmed(true)
    setTimeout(() => {
      onConfirm()
    }, 1200)
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.65rem 0.9rem",
    borderRadius: "10px", border: "1.5px solid var(--cms-border)",
    background: "var(--cms-bg)", color: "var(--cms-text-primary)",
    fontSize: "1rem", outline: "none", boxSizing: "border-box",
  }

  if (confirmed) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000 }}>
        <div style={{ background: "var(--cms-card-bg)", borderRadius: "20px", padding: "3rem 2rem", textAlign: "center", animation: "popIn 0.2s ease-out" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#10b98120", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <CheckCircle size={38} color="#10b981" />
          </div>
          <h2 style={{ fontWeight: 800, fontSize: "1.2rem", margin: "0 0 0.4rem" }}>ชำระเงินสำเร็จ</h2>
          <p style={{ color: "var(--cms-text-secondary)", fontSize: "0.88rem" }}>โต๊ะ {tableNumber} เสร็จสิ้น</p>
        </div>
        <style>{`@keyframes popIn { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:scale(1); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, padding: "1rem" }}>
      <div style={{ background: "var(--cms-card-bg)", borderRadius: "20px", width: "100%", maxWidth: 480, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 60px rgba(0,0,0,0.25)", animation: "popIn 0.2s ease-out", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "1.1rem 1.4rem", borderBottom: "1px solid var(--cms-border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1rem", margin: 0 }}>ชำระเงิน — โต๊ะ {tableNumber}</h2>
            <p style={{ fontSize: "0.75rem", color: "var(--cms-text-secondary)", margin: 0 }}>{packageName} • {people} คน</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cms-text-secondary)", display: "flex" }}><X size={20} /></button>
        </div>

        {/* Amount */}
        <div style={{ padding: "1rem 1.4rem 0", flexShrink: 0 }}>
          <div style={{ background: "var(--cms-bg)", borderRadius: "14px", padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 600, color: "var(--cms-text-secondary)", fontSize: "0.88rem" }}>ยอดชำระ</span>
            <span style={{ fontWeight: 800, fontSize: "1.6rem", color: "var(--cms-accent)" }}>฿{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--cms-border)", margin: "0.9rem 1.4rem 0", flexShrink: 0 }}>
          {([["cash", <Banknote key="c" size={15} />, "เงินสด"], ["qr", <QrCode key="q" size={15} />, "QR PromptPay"]] as const).map(([val, icon, label]) => (
            <button
              key={val}
              onClick={() => setTab(val)}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                padding: "0.6rem", border: "none", background: "none", cursor: "pointer",
                fontWeight: 700, fontSize: "0.83rem",
                borderBottom: tab === val ? "2px solid var(--cms-accent)" : "2px solid transparent",
                color: tab === val ? "var(--cms-accent)" : "var(--cms-text-secondary)",
              }}
            >{icon}{label}</button>
          ))}
        </div>

        <div style={{ overflowY: "auto", padding: "1.25rem 1.4rem", flex: 1 }}>

          {/* Cash Tab */}
          {tab === "cash" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.83rem", fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>รับเงินมา (บาท)</label>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={e => setCashReceived(e.target.value)}
                  placeholder="0"
                  style={{ ...inputStyle, fontSize: "1.4rem", fontWeight: 700, textAlign: "right" }}
                  onFocus={e => e.target.style.borderColor = "var(--cms-accent)"}
                  onBlur={e => e.target.style.borderColor = "var(--cms-border)"}
                  autoFocus
                />
              </div>

              {/* Quick presets */}
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {CASH_PRESETS.filter(p => p >= totalAmount || p >= Math.ceil(totalAmount / 100) * 100 - 50).slice(0, 5).map(preset => (
                  <button
                    key={preset}
                    onClick={() => setCashReceived(String(preset))}
                    style={{
                      padding: "0.35rem 0.8rem", borderRadius: "20px",
                      border: "1px solid var(--cms-border)", background: "transparent",
                      cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
                      color: "var(--cms-text-secondary)",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--cms-accent)"; e.currentTarget.style.color = "var(--cms-accent)" }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--cms-border)"; e.currentTarget.style.color = "var(--cms-text-secondary)" }}
                  >฿{preset}</button>
                ))}
                <button
                  onClick={() => setCashReceived(String(Math.ceil(totalAmount / 100) * 100))}
                  style={{ padding: "0.35rem 0.8rem", borderRadius: "20px", border: "1px solid var(--cms-accent)", background: "var(--cms-accent-soft)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, color: "var(--cms-accent)" }}
                >พอดี</button>
              </div>

              {/* Change */}
              {cashReceived && (
                <div style={{
                  padding: "0.9rem 1.1rem", borderRadius: "12px",
                  background: cashValid ? "#10b98115" : "#ef444415",
                  border: `1px solid ${cashValid ? "#10b98140" : "#ef444440"}`,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {cashValid
                      ? <CheckCircle size={16} color="#10b981" />
                      : <AlertCircle size={16} color="#ef4444" />}
                    <span style={{ fontWeight: 600, fontSize: "0.88rem", color: cashValid ? "#10b981" : "#ef4444" }}>
                      {cashValid ? "เงินทอน" : "ไม่เพียงพอ"}
                    </span>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: "1.1rem", color: cashValid ? "#10b981" : "#ef4444" }}>
                    ฿{cashValid ? change.toLocaleString() : (totalAmount - cashNum).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* QR Tab */}
          {tab === "qr" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              {!promptpayId ? (
                <div style={{ textAlign: "center", padding: "1.5rem" }}>
                  <QrCode size={40} color="var(--cms-text-secondary)" style={{ marginBottom: "0.75rem", opacity: 0.4 }} />
                  <p style={{ color: "var(--cms-text-secondary)", fontSize: "0.88rem", marginBottom: "1rem" }}>ยังไม่ได้ตั้งค่า PromptPay ID</p>
                  <button
                    onClick={() => { onClose(); router.push("/pos/settings") }}
                    style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", borderRadius: "10px", border: "1px solid var(--cms-border)", background: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, color: "var(--cms-text-secondary)", margin: "0 auto" }}
                  >
                    <Settings size={15} /> ไปตั้งค่า
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ padding: "1.1rem", background: "white", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                    <QRCodeSVG value={qrPayload} size={200} level="M" />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    {promptpayName && <p style={{ fontWeight: 700, fontSize: "0.95rem", margin: "0 0 0.25rem" }}>{promptpayName}</p>}
                    <p style={{ color: "var(--cms-text-secondary)", fontSize: "0.82rem", margin: 0 }}>{promptpayId}</p>
                  </div>
                  <div style={{ background: "var(--cms-accent-soft)", borderRadius: "12px", padding: "0.75rem 1.5rem", border: "1px solid var(--cms-accent)33", textAlign: "center" }}>
                    <span style={{ fontWeight: 800, fontSize: "1.3rem", color: "var(--cms-accent)" }}>฿{totalAmount.toLocaleString()}</span>
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "var(--cms-text-secondary)", textAlign: "center", margin: 0 }}>
                    ให้ลูกค้าสแกน QR แล้วกด "รับเงินแล้ว"
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "1rem 1.4rem", borderTop: "1px solid var(--cms-border)", display: "flex", gap: "0.75rem", flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "0.7rem", borderRadius: "12px", border: "1.5px solid var(--cms-border)", background: "none", cursor: "pointer", fontWeight: 600, color: "var(--cms-text-secondary)" }}>
            ยกเลิก
          </button>
          <button
            onClick={handleConfirm}
            disabled={tab === "cash" && !cashValid}
            className="cms-button-primary"
            style={{ flex: 2, justifyContent: "center", padding: "0.7rem", opacity: tab === "cash" && !cashValid ? 0.4 : 1 }}
          >
            <CheckCircle size={16} />
            {tab === "cash" ? "ยืนยันรับเงิน" : "รับเงินแล้ว"}
          </button>
        </div>
      </div>

      <style>{`@keyframes popIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>
    </div>
  )
}
