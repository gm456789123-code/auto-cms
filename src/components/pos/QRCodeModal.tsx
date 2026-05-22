"use client"

import React, { useEffect, useState } from "react"
import { X, Download, Copy, Check } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

interface Props {
  tableNumber: number
  tableId: number | string
  token?: string
  onClose: () => void
}

export default function QRCodeModal({ tableNumber, tableId, token, onClose }: Props) {
  const [url, setUrl] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const base = `${window.location.origin}/menu/${tableId}`
    setUrl(token ? `${base}?t=${encodeURIComponent(token)}` : base)
  }, [tableId, token])

  function copyUrl() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function downloadSVG() {
    const svg = document.getElementById("table-qr-svg")
    if (!svg) return
    const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `QR-โต๊ะ${tableNumber}.svg`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 3000, padding: "1rem",
      }}
    >
      <div style={{
        background: "var(--cms-card-bg)", borderRadius: "20px",
        width: "100%", maxWidth: 380,
        boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
        animation: "popIn 0.2s ease-out",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "1.1rem 1.4rem",
          borderBottom: "1px solid var(--cms-border)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1rem", margin: 0 }}>QR Code โต๊ะ {tableNumber}</h2>
            <p style={{ fontSize: "0.75rem", color: "var(--cms-text-secondary)", margin: 0 }}>ลูกค้าสแกนเพื่อสั่งอาหาร</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cms-text-secondary)", display: "flex" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
          {/* QR */}
          <div style={{
            padding: "1.25rem",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 200 + 40, height: 200 + 40,
          }}>
            {url ? (
              <QRCodeSVG
                id="table-qr-svg"
                value={url}
                size={200}
                level="M"
                includeMargin={false}
              />
            ) : (
              <div style={{ width: 36, height: 36, border: "3px solid #e2e8f0", borderTopColor: "var(--cms-accent)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            )}
          </div>

          {/* Table label */}
          <div style={{
            textAlign: "center",
            padding: "0.6rem 2rem",
            background: "var(--cms-accent-soft)",
            borderRadius: "12px",
            border: "1px solid var(--cms-accent)33",
          }}>
            <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--cms-accent)" }}>โต๊ะ {tableNumber}</span>
          </div>

          {/* URL */}
          <div style={{
            width: "100%",
            background: "var(--cms-bg)",
            borderRadius: "10px",
            padding: "0.55rem 0.9rem",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem",
            border: "1px solid var(--cms-border)",
          }}>
            <span style={{ fontSize: "0.75rem", color: "var(--cms-text-secondary)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {url}
            </span>
            <button
              onClick={copyUrl}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: copied ? "#10b981" : "var(--cms-text-secondary)",
                display: "flex", flexShrink: 0,
              }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.65rem", width: "100%" }}>
            <button
              onClick={downloadSVG}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                padding: "0.65rem", borderRadius: "12px",
                border: "1.5px solid var(--cms-border)", background: "none",
                cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
                color: "var(--cms-text-secondary)",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--cms-accent)"; e.currentTarget.style.color = "var(--cms-accent)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--cms-border)"; e.currentTarget.style.color = "var(--cms-text-secondary)" }}
            >
              <Download size={15} /> ดาวน์โหลด
            </button>
            <button
              onClick={onClose}
              className="cms-button-primary"
              style={{ flex: 1, justifyContent: "center", padding: "0.65rem" }}
            >
              ปิด
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes spin   { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
