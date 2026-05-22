"use client"

import React, { useState } from "react"
import { X, Users, Clock, CheckCircle } from "lucide-react"
import { loadPackages } from "@/lib/packageStore"
import { Package } from "@/types/pos"

const PACKAGES = loadPackages()

interface Props {
  tableNumber: number
  onConfirm: (packageId: string, people: number) => void
  onClose: () => void
}

export default function OpenTableModal({ tableNumber, onConfirm, onClose }: Props) {
  const [selectedPkg, setSelectedPkg] = useState<Package>(PACKAGES[1] ?? PACKAGES[0])
  const [people, setPeople] = useState(2)

  const total = selectedPkg.price * people

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.5)",
      backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 2000, padding: "1rem",
    }}>
      <div style={{
        background: "var(--cms-card-bg)",
        borderRadius: "20px",
        width: "100%", maxWidth: "520px",
        boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
        overflow: "hidden",
        animation: "popIn 0.2s ease-out",
      }}>
        {/* Header */}
        <div style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--cms-border)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.1rem", margin: 0 }}>เปิดโต๊ะ {tableNumber}</h2>
            <p style={{ color: "var(--cms-text-secondary)", fontSize: "0.8rem", margin: 0 }}>เลือกแพ็คเกจและจำนวนคน</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cms-text-secondary)", display: "flex" }}>
            <X size={22} />
          </button>
        </div>

        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Package Selection */}
          <div>
            <label style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--cms-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.75rem" }}>
              เลือกแพ็คเกจ
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {PACKAGES.map(pkg => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg)}
                  style={{
                    border: `2px solid ${selectedPkg.id === pkg.id ? pkg.color : "var(--cms-border)"}`,
                    borderRadius: "14px",
                    padding: "0.9rem 1.1rem",
                    cursor: "pointer",
                    background: selectedPkg.id === pkg.id ? `${pkg.color}0d` : "transparent",
                    transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: "1rem",
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: "12px",
                    background: pkg.gradient, overflow: "hidden",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {pkg.image
                      ? <img src={pkg.image} alt={pkg.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ color: "white", fontSize: "0.75rem", fontWeight: 800 }}>{pkg.name.split(" ")[1]}</span>
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{pkg.name}</span>
                      {pkg.badge && (
                        <span style={{
                          fontSize: "0.65rem", fontWeight: 700,
                          background: pkg.gradient, color: "white",
                          borderRadius: "6px", padding: "2px 7px",
                        }}>{pkg.badge}</span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--cms-text-secondary)", marginTop: "0.15rem" }}>{pkg.description}</div>
                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.3rem" }}>
                      <span style={{ fontSize: "0.78rem", color: pkg.color, fontWeight: 700 }}>
                        ฿{pkg.price}/คน
                      </span>
                      <span style={{ fontSize: "0.78rem", color: "var(--cms-text-secondary)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Clock size={12} />
                        {pkg.timeLimitMinutes} นาที
                      </span>
                    </div>
                  </div>
                  {selectedPkg.id === pkg.id && (
                    <CheckCircle size={20} color={pkg.color} style={{ flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* People Count */}
          <div>
            <label style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--cms-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.75rem" }}>
              จำนวนคน
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <button
                onClick={() => setPeople(p => Math.max(1, p - 1))}
                style={{
                  width: 40, height: 40, borderRadius: "10px",
                  border: "1.5px solid var(--cms-border)",
                  background: "none", cursor: "pointer",
                  fontSize: "1.3rem", fontWeight: 700,
                  color: "var(--cms-text-primary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >−</button>
              <div style={{ textAlign: "center", minWidth: 80 }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1 }}>{people}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--cms-text-secondary)" }}>คน</div>
              </div>
              <button
                onClick={() => setPeople(p => p + 1)}
                style={{
                  width: 40, height: 40, borderRadius: "10px",
                  border: "1.5px solid var(--cms-border)",
                  background: "none", cursor: "pointer",
                  fontSize: "1.3rem", fontWeight: 700,
                  color: "var(--cms-text-primary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >+</button>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div style={{ fontSize: "0.78rem", color: "var(--cms-text-secondary)" }}>รวม</div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: selectedPkg.color }}>
                  ฿{total.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div style={{
            background: "var(--cms-bg)",
            borderRadius: "12px",
            padding: "0.9rem 1.1rem",
            display: "flex", justifyContent: "space-between", fontSize: "0.85rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--cms-text-secondary)" }}>
              <Users size={14} />
              {people} คน × ฿{selectedPkg.price}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--cms-text-secondary)" }}>
              <Clock size={14} />
              จำกัดเวลา {selectedPkg.timeLimitMinutes} นาที
            </div>
          </div>

          {/* Confirm */}
          <button
            onClick={() => onConfirm(selectedPkg.id, people)}
            className="cms-button-primary"
            style={{ width: "100%", justifyContent: "center", padding: "0.8rem", fontSize: "0.95rem" }}
          >
            เปิดโต๊ะ {tableNumber}
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
