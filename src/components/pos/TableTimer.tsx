"use client"

import React, { useEffect, useState } from "react"
import { Clock, AlertTriangle } from "lucide-react"

interface Props {
  openedAt: string
  timeLimitMinutes: number
  timeLimitEnabled: boolean
  warningMinutes?: number
  onTimeUp?: () => void
  onWarning?: () => void
}

export default function TableTimer({
  openedAt, timeLimitMinutes, timeLimitEnabled,
  warningMinutes = 15, onTimeUp, onWarning,
}: Props) {
  const [elapsed, setElapsed] = useState(0)
  const [warnedOnce, setWarnedOnce] = useState(false)
  const [timeUpOnce, setTimeUpOnce] = useState(false)

  useEffect(() => {
    const tick = () => {
      const mins = Math.floor((Date.now() - new Date(openedAt).getTime()) / 60000)
      setElapsed(mins)
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [openedAt])

  const remaining = timeLimitEnabled ? Math.max(0, timeLimitMinutes - elapsed) : null
  const isOvertime = timeLimitEnabled && elapsed >= timeLimitMinutes
  const isWarning = timeLimitEnabled && !isOvertime && remaining !== null && remaining <= warningMinutes

  useEffect(() => {
    if (isWarning && !warnedOnce) {
      setWarnedOnce(true)
      onWarning?.()
    }
  }, [isWarning, warnedOnce, onWarning])

  useEffect(() => {
    if (isOvertime && !timeUpOnce) {
      setTimeUpOnce(true)
      onTimeUp?.()
    }
  }, [isOvertime, timeUpOnce, onTimeUp])

  function fmtMins(mins: number) {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    if (h > 0) return `${h}ชม. ${m}น.`
    return `${m} นาที`
  }

  const color = isOvertime ? "#ef4444" : isWarning ? "#f59e0b" : "#10b981"

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.5rem",
      background: `${color}12`,
      border: `1px solid ${color}40`,
      borderRadius: "10px",
      padding: "0.45rem 0.85rem",
      fontSize: "0.8rem", fontWeight: 600,
    }}>
      {isOvertime || isWarning
        ? <AlertTriangle size={14} color={color} />
        : <Clock size={14} color={color} />
      }
      <span style={{ color }}>
        {timeLimitEnabled
          ? isOvertime
            ? `เกินเวลา ${fmtMins(elapsed - timeLimitMinutes)}`
            : `เหลือ ${fmtMins(remaining!)}`
          : `ใช้ไป ${fmtMins(elapsed)}`
        }
      </span>
    </div>
  )
}
