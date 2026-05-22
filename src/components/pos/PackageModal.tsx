"use client"

import React, { useState, useRef } from "react"
import { X, Plus, Trash2, GripVertical, ImagePlus, XCircle } from "lucide-react"
import { Package, PackageMenuItem } from "@/types/pos"

interface Props {
  initial?: Package
  onSave: (pkg: Package) => void
  onClose: () => void
}

const COLOR_PRESETS = [
  { color: "#10b981", gradient: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)" },
  { color: "#3b82f6", gradient: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)" },
  { color: "#8b5cf6", gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)" },
  { color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)" },
  { color: "#ef4444", gradient: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)" },
]

const EMOJI_SUGGESTIONS = ["🥩","🍗","🦐","🦑","🥦","🌽","🍄","🥕","🍤","🦀","🐟","🥚","💧","🧃","🍵","🥤","🍺","🧊","🍦","🧇","🍰","🍮"]

const EMPTY_ITEM: Omit<PackageMenuItem, "id"> = { name: "", emoji: "🍽️", isExtra: false, extraPrice: 0 }

export default function PackageModal({ initial, onSave, onClose }: Props) {
  const isEdit = !!initial
  const [name, setName]               = useState(initial?.name ?? "")
  const [price, setPrice]             = useState(initial?.price ?? 199)
  const [timeLimit, setTimeLimit]     = useState(initial?.timeLimitMinutes ?? 90)
  const [description, setDescription] = useState(initial?.description ?? "")
  const [badge, setBadge]             = useState(initial?.badge ?? "")
  const [colorIdx, setColorIdx]       = useState(() => {
    if (!initial) return 0
    return COLOR_PRESETS.findIndex(c => c.color === initial.color) ?? 0
  })
  const [menuItems, setMenuItems]     = useState<PackageMenuItem[]>(initial?.menuItems ?? [])
  const [newItem, setNewItem]         = useState<Omit<PackageMenuItem, "id">>({ ...EMPTY_ITEM })
  const [emojiOpen, setEmojiOpen]     = useState(false)
  const [image, setImage]             = useState<string | undefined>(initial?.image)
  const [dragOver, setDragOver]       = useState(false)
  const fileInputRef                  = useRef<HTMLInputElement>(null)

  const selectedColor = COLOR_PRESETS[colorIdx] ?? COLOR_PRESETS[0]

  function processImageFile(file: File) {
    if (!file.type.startsWith("image/")) return
    if (file.size > 5 * 1024 * 1024) { alert("ไฟล์ใหญ่เกินไป (สูงสุด 5 MB)"); return }
    const reader = new FileReader()
    reader.onload = e => {
      const src = e.target?.result as string
      const img = new Image()
      img.onload = () => {
        const MAX = 800
        const scale = Math.min(1, MAX / Math.max(img.width, img.height))
        const canvas = document.createElement("canvas")
        canvas.width  = Math.round(img.width  * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height)
        setImage(canvas.toDataURL("image/jpeg", 0.82))
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }

  function addItem() {
    if (!newItem.name.trim()) return
    setMenuItems(prev => [...prev, { ...newItem, id: `i_${Date.now()}` }])
    setNewItem({ ...EMPTY_ITEM })
  }

  function removeItem(id: string) {
    setMenuItems(prev => prev.filter(i => i.id !== id))
  }

  function toggleExtra(id: string) {
    setMenuItems(prev => prev.map(i => i.id === id ? { ...i, isExtra: !i.isExtra, extraPrice: !i.isExtra ? i.extraPrice || 0 : i.extraPrice } : i))
  }

  function updateExtraPrice(id: string, price: number) {
    setMenuItems(prev => prev.map(i => i.id === id ? { ...i, extraPrice: price } : i))
  }

  function handleSave() {
    if (!name.trim() || price <= 0) return
    const pkg: Package = {
      id: initial?.id ?? `pkg_${Date.now()}`,
      name: name.trim(),
      price,
      timeLimitMinutes: timeLimit,
      color: selectedColor.color,
      gradient: selectedColor.gradient,
      description: description.trim(),
      badge: badge.trim() || undefined,
      image,
      menuItems,
    }
    onSave(pkg)
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.6rem 0.9rem",
    borderRadius: "10px", border: "1.5px solid var(--cms-border)",
    background: "var(--cms-bg)", color: "var(--cms-text-primary)",
    fontSize: "0.88rem", outline: "none", boxSizing: "border-box",
  }

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 2000, padding: "1rem",
    }}>
      <div style={{
        background: "var(--cms-card-bg)", borderRadius: "20px",
        width: "100%", maxWidth: "680px", maxHeight: "90vh",
        display: "flex", flexDirection: "column",
        boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
        animation: "popIn 0.2s ease-out",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--cms-border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <h2 style={{ fontWeight: 800, fontSize: "1.05rem", margin: 0 }}>
            {isEdit ? "แก้ไขแพ็คเกจ" : "เพิ่มแพ็คเกจใหม่"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cms-text-secondary)", display: "flex" }}>
            <X size={22} />
          </button>
        </div>

        <div style={{ overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.4rem" }}>
          {/* Row 1: Name + Price + Time */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 110px", gap: "0.75rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>ชื่อแพ็คเกจ *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="เช่น แพ็คเกจ 199" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--cms-accent)"}
                onBlur={e => e.target.style.borderColor = "var(--cms-border)"} />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>ราคา (฿/คน) *</label>
              <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} min={1} style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--cms-accent)"}
                onBlur={e => e.target.style.borderColor = "var(--cms-border)"} />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>เวลา (นาที)</label>
              <input type="number" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} min={30} step={15} style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--cms-accent)"}
                onBlur={e => e.target.style.borderColor = "var(--cms-border)"} />
            </div>
          </div>

          {/* Row 2: Description + Badge */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: "0.75rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>คำอธิบาย</label>
              <input value={description} onChange={e => setDescription(e.target.value)} placeholder="เช่น อาหาร + เครื่องดื่มฟรี" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--cms-accent)"}
                onBlur={e => e.target.style.borderColor = "var(--cms-border)"} />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Badge</label>
              <input value={badge} onChange={e => setBadge(e.target.value)} placeholder="เช่น แนะนำ" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--cms-accent)"}
                onBlur={e => e.target.style.borderColor = "var(--cms-border)"} />
            </div>
          </div>

          {/* Color */}
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.6rem" }}>สีแพ็คเกจ</label>
            <div style={{ display: "flex", gap: "0.6rem" }}>
              {COLOR_PRESETS.map((c, i) => (
                <button key={i} onClick={() => setColorIdx(i)} style={{
                  width: 36, height: 36, borderRadius: "10px",
                  background: c.gradient, border: `3px solid ${colorIdx === i ? "var(--cms-text-primary)" : "transparent"}`,
                  cursor: "pointer", transition: "transform 0.15s",
                  transform: colorIdx === i ? "scale(1.15)" : "scale(1)",
                }} />
              ))}
              <div style={{
                flex: 1, height: 36, borderRadius: "10px",
                background: selectedColor.gradient,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: "0.78rem", fontWeight: 700,
              }}>
                ฿{price}/คน • {timeLimit} นาที
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.6rem" }}>รูปภาพแพ็คเกจ</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={e => { const f = e.target.files?.[0]; if (f) processImageFile(f); e.target.value = "" }}
            />
            {image ? (
              <div style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={image}
                  alt="package"
                  style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: "12px", border: "2px solid var(--cms-border)", display: "block" }}
                />
                <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem", display: "flex", gap: "0.4rem" }}>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "8px",
                      color: "white", padding: "0.35rem 0.7rem", fontSize: "0.75rem",
                      fontWeight: 600, cursor: "pointer", backdropFilter: "blur(4px)",
                    }}
                  >เปลี่ยนรูป</button>
                  <button
                    onClick={() => setImage(undefined)}
                    style={{
                      background: "rgba(239,68,68,0.8)", border: "none", borderRadius: "8px",
                      color: "white", padding: "0.35rem 0.5rem", cursor: "pointer",
                      display: "flex", alignItems: "center", backdropFilter: "blur(4px)",
                    }}
                  ><XCircle size={15} /></button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) processImageFile(f) }}
                style={{
                  border: `2px dashed ${dragOver ? "var(--cms-accent)" : "var(--cms-border)"}`,
                  borderRadius: "12px", padding: "2rem",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: "0.5rem", cursor: "pointer", transition: "all 0.15s",
                  background: dragOver ? "var(--cms-accent-soft)" : "transparent",
                }}
              >
                <ImagePlus size={28} color={dragOver ? "var(--cms-accent)" : "var(--cms-text-secondary)"} />
                <span style={{ fontSize: "0.83rem", fontWeight: 600, color: dragOver ? "var(--cms-accent)" : "var(--cms-text-secondary)" }}>
                  คลิกเพื่ออัปโหลด หรือลากรูปมาวาง
                </span>
                <span style={{ fontSize: "0.73rem", color: "var(--cms-text-secondary)" }}>PNG, JPG, WEBP — สูงสุด 5 MB</span>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.75rem" }}>
              เมนูอาหาร ({menuItems.length} รายการ)
            </label>

            {/* Existing items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
              {menuItems.map(item => (
                <div key={item.id} style={{
                  display: "flex", alignItems: "center", gap: "0.6rem",
                  background: "var(--cms-bg)", borderRadius: "10px",
                  padding: "0.5rem 0.75rem",
                  border: "1px solid var(--cms-border)",
                }}>
                  <GripVertical size={14} color="var(--cms-text-secondary)" style={{ flexShrink: 0, cursor: "grab" }} />
                  <span style={{ fontSize: "1.2rem" }}>{item.emoji}</span>
                  <span style={{ flex: 1, fontWeight: 500, fontSize: "0.85rem" }}>{item.name}</span>

                  <button
                    onClick={() => toggleExtra(item.id)}
                    style={{
                      padding: "0.2rem 0.6rem", borderRadius: "6px", border: "1px solid",
                      fontSize: "0.72rem", fontWeight: 600, cursor: "pointer",
                      background: item.isExtra ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)",
                      borderColor: item.isExtra ? "#f59e0b" : "#10b981",
                      color: item.isExtra ? "#f59e0b" : "#10b981",
                    }}
                  >
                    {item.isExtra ? "พิเศษ" : "รวมแพ็ค"}
                  </button>

                  {item.isExtra && (
                    <input
                      type="number"
                      value={item.extraPrice}
                      onChange={e => updateExtraPrice(item.id, Number(e.target.value))}
                      placeholder="฿"
                      style={{ width: 60, padding: "0.2rem 0.4rem", borderRadius: "6px", border: "1px solid var(--cms-border)", background: "var(--cms-card-bg)", color: "var(--cms-text-primary)", fontSize: "0.8rem", outline: "none", textAlign: "center" }}
                    />
                  )}

                  <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cms-danger)", display: "flex", flexShrink: 0 }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new item */}
            <div style={{
              border: "1.5px dashed var(--cms-border)", borderRadius: "12px",
              padding: "0.85rem", display: "flex", gap: "0.6rem", alignItems: "center",
              flexWrap: "wrap",
            }}>
              {/* Emoji picker */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setEmojiOpen(o => !o)}
                  style={{
                    width: 38, height: 38, borderRadius: "10px",
                    border: "1.5px solid var(--cms-border)", background: "var(--cms-bg)",
                    fontSize: "1.3rem", cursor: "pointer",
                  }}
                >
                  {newItem.emoji}
                </button>
                {emojiOpen && (
                  <div style={{
                    position: "absolute", top: "110%", left: 0,
                    background: "var(--cms-card-bg)", border: "1px solid var(--cms-border)",
                    borderRadius: "12px", padding: "0.6rem", zIndex: 10,
                    display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.3rem",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  }}>
                    {EMOJI_SUGGESTIONS.map(e => (
                      <button key={e} onClick={() => { setNewItem(p => ({ ...p, emoji: e })); setEmojiOpen(false) }}
                        style={{ fontSize: "1.3rem", background: "none", border: "none", cursor: "pointer", borderRadius: "6px", padding: "0.2rem", lineHeight: 1 }}
                        onMouseEnter={ev => ev.currentTarget.style.background = "var(--cms-accent-soft)"}
                        onMouseLeave={ev => ev.currentTarget.style.background = "none"}
                      >{e}</button>
                    ))}
                  </div>
                )}
              </div>

              <input
                value={newItem.name}
                onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && addItem()}
                placeholder="ชื่อเมนู..."
                style={{ ...inputStyle, flex: "1 1 120px", width: "auto" }}
                onFocus={e => e.target.style.borderColor = "var(--cms-accent)"}
                onBlur={e => e.target.style.borderColor = "var(--cms-border)"}
              />

              <button
                onClick={() => setNewItem(p => ({ ...p, isExtra: !p.isExtra }))}
                style={{
                  padding: "0.4rem 0.75rem", borderRadius: "8px", border: "1px solid",
                  fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
                  background: newItem.isExtra ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)",
                  borderColor: newItem.isExtra ? "#f59e0b" : "#10b981",
                  color: newItem.isExtra ? "#f59e0b" : "#10b981",
                  whiteSpace: "nowrap",
                }}
              >
                {newItem.isExtra ? "พิเศษ" : "รวมแพ็ค"}
              </button>

              {newItem.isExtra && (
                <input
                  type="number"
                  value={newItem.extraPrice}
                  onChange={e => setNewItem(p => ({ ...p, extraPrice: Number(e.target.value) }))}
                  placeholder="฿"
                  style={{ width: 65, padding: "0.4rem 0.5rem", borderRadius: "8px", border: "1.5px solid var(--cms-border)", background: "var(--cms-bg)", color: "var(--cms-text-primary)", fontSize: "0.85rem", outline: "none", textAlign: "center" }}
                />
              )}

              <button
                onClick={addItem}
                disabled={!newItem.name.trim()}
                style={{
                  display: "flex", alignItems: "center", gap: "0.3rem",
                  padding: "0.4rem 0.85rem", borderRadius: "8px",
                  background: newItem.name.trim() ? "var(--cms-accent)" : "var(--cms-border)",
                  color: newItem.name.trim() ? "white" : "var(--cms-text-secondary)",
                  border: "none", cursor: newItem.name.trim() ? "pointer" : "not-allowed",
                  fontWeight: 600, fontSize: "0.82rem",
                }}
              >
                <Plus size={14} /> เพิ่ม
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--cms-border)", display: "flex", gap: "0.75rem", flexShrink: 0 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "0.7rem", borderRadius: "12px",
            border: "1.5px solid var(--cms-border)", background: "none",
            cursor: "pointer", fontWeight: 600, color: "var(--cms-text-secondary)",
          }}>ยกเลิก</button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || price <= 0}
            className="cms-button-primary"
            style={{ flex: 2, justifyContent: "center", padding: "0.7rem", opacity: !name.trim() || price <= 0 ? 0.5 : 1 }}
          >
            {isEdit ? "บันทึกการแก้ไข" : "สร้างแพ็คเกจ"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
