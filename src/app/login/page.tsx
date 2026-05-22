"use client"

import React from "react"
import { signIn } from "next-auth/react"
import { ShoppingBag } from "lucide-react"

export default function LoginPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--cms-bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            width: 64, height: 64,
            background: "linear-gradient(135deg, var(--cms-accent) 0%, #8b5cf6 100%)",
            borderRadius: "20px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
            boxShadow: "0 8px 24px rgba(59, 130, 246, 0.35)",
          }}>
            <ShoppingBag size={30} color="white" />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0 }}>Auto CMS</h1>
          <p style={{ color: "var(--cms-text-secondary)", fontSize: "0.9rem", marginTop: "0.4rem" }}>
            ระบบจัดการร้านค้าครบวงจร
          </p>
        </div>

        {/* Card */}
        <div className="cms-card" style={{ padding: "2rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.4rem" }}>เข้าสู่ระบบ</h2>
          <p style={{ color: "var(--cms-text-secondary)", fontSize: "0.85rem", marginBottom: "1.75rem" }}>
            เข้าสู่ระบบด้วย Google เพื่อจัดการร้านของคุณ
          </p>

          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              padding: "0.8rem 1.5rem",
              background: "var(--cms-card-bg)",
              border: "1.5px solid var(--cms-border)",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "var(--cms-text-primary)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--cms-accent)"
              e.currentTarget.style.transform = "translateY(-1px)"
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(59,130,246,0.15)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--cms-border)"
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "none"
            }}
          >
            <GoogleIcon />
            เข้าสู่ระบบด้วย Google
          </button>

          <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--cms-text-secondary)", marginTop: "1.25rem" }}>
            การเข้าสู่ระบบหมายความว่าคุณยอมรับ{" "}
            <span style={{ color: "var(--cms-accent)", cursor: "pointer" }}>นโยบายความเป็นส่วนตัว</span>
          </p>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
