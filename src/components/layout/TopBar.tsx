"use client"

import React from "react"
import { useSession, signOut } from "next-auth/react"
import { Sun, Moon, LogOut } from "lucide-react"
import { useCMSTheme } from "@/master_cms/context/ThemeContext"
import NotificationBell from "@/components/ui/NotificationBell"
import Image from "next/image"

export default function TopBar() {
  const { data: session } = useSession()
  const { theme, toggleTheme } = useCMSTheme()

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "var(--cms-card-bg)",
      borderBottom: "1px solid var(--cms-border)",
      padding: "0 1.5rem",
      height: 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backdropFilter: "blur(8px)",
    }}>
      {/* Left - Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <div style={{
          width: 32, height: 32,
          background: "linear-gradient(135deg, var(--cms-accent) 0%, #8b5cf6 100%)",
          borderRadius: "9px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ color: "white", fontSize: "1rem" }}>🛍️</span>
        </div>
        <span style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.3px" }}>Auto CMS</span>
      </div>

      {/* Right - Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          style={{
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
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        {/* Bell */}
        <NotificationBell />

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: "var(--cms-border)" }} />

        {/* User profile */}
        {session?.user && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? "user"}
                width={32}
                height={32}
                style={{ borderRadius: "50%", border: "2px solid var(--cms-accent)" }}
              />
            ) : (
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--cms-accent) 0%, #8b5cf6 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 700, fontSize: "0.8rem",
              }}>
                {session.user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 600 }}>{session.user.name}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--cms-text-secondary)" }}>{session.user.email}</div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            background: "none",
            border: "1px solid var(--cms-border)",
            borderRadius: "10px",
            width: 38, height: 38,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            color: "var(--cms-text-secondary)",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "var(--cms-danger)"
            e.currentTarget.style.color = "var(--cms-danger)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "var(--cms-border)"
            e.currentTarget.style.color = "var(--cms-text-secondary)"
          }}
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  )
}
