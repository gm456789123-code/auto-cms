"use client"

import React, { useState, useRef, useEffect } from "react"
import { Bell, ShoppingBag, AlertTriangle, Settings, CheckCheck } from "lucide-react"
import { useNotification, NotifType } from "@/context/NotificationContext"

const typeIcon: Record<NotifType, React.ReactNode> = {
  order:  <ShoppingBag size={16} color="#3b82f6" />,
  stock:  <AlertTriangle size={16} color="#f59e0b" />,
  system: <Settings size={16} color="#8b5cf6" />,
}

const typeBg: Record<NotifType, string> = {
  order:  "rgba(59,130,246,0.12)",
  stock:  "rgba(245,158,11,0.12)",
  system: "rgba(139,92,246,0.12)",
}

function timeAgo(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 60000)
  if (diff < 1) return "เมื่อกี้"
  if (diff < 60) return `${diff} นาทีที่แล้ว`
  const h = Math.floor(diff / 60)
  return `${h} ชั่วโมงที่แล้ว`
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead, markRead } = useNotification()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "relative",
          background: "none",
          border: "1px solid var(--cms-border)",
          borderRadius: "10px",
          width: 38, height: 38,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          color: "var(--cms-text-secondary)",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "var(--cms-accent)"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--cms-border)"}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4,
            background: "#ef4444",
            color: "white",
            borderRadius: "50%",
            width: 18, height: 18,
            fontSize: "0.65rem",
            fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid var(--cms-bg)",
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          right: 0,
          width: 340,
          background: "var(--cms-card-bg)",
          border: "1px solid var(--cms-border)",
          borderRadius: "16px",
          boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
          zIndex: 1000,
          overflow: "hidden",
          animation: "slideDown 0.2s ease-out",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid var(--cms-border)",
          }}>
            <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
              การแจ้งเตือน {unreadCount > 0 && <span style={{ color: "#ef4444" }}>({unreadCount})</span>}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--cms-accent)", fontSize: "0.78rem", fontWeight: 600,
                  display: "flex", alignItems: "center", gap: "0.3rem",
                }}
              >
                <CheckCheck size={14} />
                อ่านทั้งหมด
              </button>
            )}
          </div>

          <div style={{ maxHeight: 320, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--cms-text-secondary)", fontSize: "0.85rem" }}>
                ไม่มีการแจ้งเตือน
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  style={{
                    display: "flex", gap: "0.75rem", padding: "0.85rem 1.25rem",
                    borderBottom: "1px solid var(--cms-border)",
                    background: n.read ? "transparent" : "var(--cms-accent-soft)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--cms-accent-soft)")}
                  onMouseLeave={e => (e.currentTarget.style.background = n.read ? "transparent" : "var(--cms-accent-soft)")}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: "10px",
                    background: typeBg[n.type],
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {typeIcon[n.type]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{n.title}</span>
                      {!n.read && (
                        <span style={{ width: 7, height: 7, background: "#3b82f6", borderRadius: "50%", flexShrink: 0 }} />
                      )}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--cms-text-secondary)", marginTop: "0.15rem" }}>{n.message}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--cms-text-secondary)", marginTop: "0.25rem" }}>{timeAgo(n.time)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
