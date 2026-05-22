"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Store, Phone, MapPin, ArrowRight } from "lucide-react"

export default function SetupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ shopName: "", phone: "", address: "" })
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.shopName.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    router.push("/")
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--cms-bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
    }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: 56, height: 56,
            background: "linear-gradient(135deg, var(--cms-accent) 0%, #8b5cf6 100%)",
            borderRadius: "16px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
          }}>
            <Store size={26} color="white" />
          </div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0 }}>ตั้งค่าร้านของคุณ</h1>
          <p style={{ color: "var(--cms-text-secondary)", fontSize: "0.85rem", marginTop: "0.4rem" }}>
            กรอกข้อมูลเบื้องต้นก่อนเริ่มใช้งาน
          </p>
        </div>

        <div className="cms-card" style={{ padding: "2rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                <Store size={15} color="var(--cms-accent)" />
                ชื่อร้าน <span style={{ color: "var(--cms-danger)" }}>*</span>
              </label>
              <input
                name="shopName"
                value={form.shopName}
                onChange={handleChange}
                placeholder="เช่น ร้านบุฟเฟ่สุขใจ"
                required
                style={{
                  width: "100%",
                  padding: "0.65rem 1rem",
                  borderRadius: "10px",
                  border: "1.5px solid var(--cms-border)",
                  background: "var(--cms-bg)",
                  color: "var(--cms-text-primary)",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => (e.target.style.borderColor = "var(--cms-accent)")}
                onBlur={e => (e.target.style.borderColor = "var(--cms-border)")}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                <Phone size={15} color="var(--cms-accent)" />
                เบอร์โทร
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="เช่น 081-234-5678"
                style={{
                  width: "100%",
                  padding: "0.65rem 1rem",
                  borderRadius: "10px",
                  border: "1.5px solid var(--cms-border)",
                  background: "var(--cms-bg)",
                  color: "var(--cms-text-primary)",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => (e.target.style.borderColor = "var(--cms-accent)")}
                onBlur={e => (e.target.style.borderColor = "var(--cms-border)")}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                <MapPin size={15} color="var(--cms-accent)" />
                ที่อยู่ร้าน
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="เช่น 123 ถนนสุขุมวิท กรุงเทพฯ"
                style={{
                  width: "100%",
                  padding: "0.65rem 1rem",
                  borderRadius: "10px",
                  border: "1.5px solid var(--cms-border)",
                  background: "var(--cms-bg)",
                  color: "var(--cms-text-primary)",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => (e.target.style.borderColor = "var(--cms-accent)")}
                onBlur={e => (e.target.style.borderColor = "var(--cms-border)")}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !form.shopName.trim()}
              className="cms-button-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "0.75rem",
                opacity: loading || !form.shopName.trim() ? 0.6 : 1,
                cursor: loading || !form.shopName.trim() ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "กำลังบันทึก..." : (
                <>
                  เริ่มใช้งาน
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
