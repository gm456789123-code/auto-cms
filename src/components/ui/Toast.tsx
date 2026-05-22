"use client"

import React from "react"
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react"
import { useNotification, ToastType } from "@/context/NotificationContext"

const config: Record<ToastType, { icon: React.ReactNode; color: string; bg: string }> = {
  success: { icon: <CheckCircle size={18} />, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  error:   { icon: <XCircle size={18} />,     color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  warning: { icon: <AlertTriangle size={18} />, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  info:    { icon: <Info size={18} />,          color: "var(--cms-accent)", bg: "var(--cms-accent-soft)" },
}

export default function ToastContainer() {
  const { toasts, dismissToast } = useNotification()

  return (
    <div style={{
      position: "fixed",
      bottom: "1.5rem",
      right: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.6rem",
      zIndex: 9999,
      pointerEvents: "none",
    }}>
      {toasts.map(t => {
        const c = config[t.type]
        return (
          <div
            key={t.id}
            style={{
              background: "var(--cms-card-bg)",
              border: `1px solid ${c.color}44`,
              borderLeft: `4px solid ${c.color}`,
              borderRadius: "12px",
              padding: "0.75rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              minWidth: "280px",
              maxWidth: "360px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              pointerEvents: "all",
              animation: "slideInRight 0.25s ease-out",
            }}
          >
            <span style={{ color: c.color, display: "flex", flexShrink: 0 }}>{c.icon}</span>
            <span style={{ flex: 1, fontSize: "0.875rem", fontWeight: 500, color: "var(--cms-text-primary)" }}>
              {t.message}
            </span>
            <button
              onClick={() => dismissToast(t.id)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cms-text-secondary)", display: "flex", padding: 0 }}
            >
              <X size={15} />
            </button>
          </div>
        )
      })}

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
