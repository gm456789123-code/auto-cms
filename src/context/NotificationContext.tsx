"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

export type ToastType = "success" | "error" | "warning" | "info"
export type NotifType = "order" | "stock" | "system"

export interface Toast {
  id: string
  type: ToastType
  message: string
}

export interface Notification {
  id: string
  type: NotifType
  title: string
  message: string
  read: boolean
  time: Date
}

interface NotificationContextType {
  toasts: Toast[]
  notifications: Notification[]
  unreadCount: number
  toast: {
    success: (message: string) => void
    error: (message: string) => void
    warning: (message: string) => void
    info: (message: string) => void
  }
  addNotification: (n: Omit<Notification, "id" | "read" | "time">) => void
  markAllRead: () => void
  markRead: (id: string) => void
  dismissToast: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", type: "order", title: "ออเดอร์ใหม่", message: "โต๊ะ 3 สั่งอาหารใหม่ 2 รายการ", read: false, time: new Date(Date.now() - 2 * 60000) },
  { id: "2", type: "stock", title: "สต็อกใกล้หมด", message: "น้ำส้มเหลือน้อยกว่า 5 ขวด", read: false, time: new Date(Date.now() - 15 * 60000) },
  { id: "3", type: "system", title: "ระบบอัพเดท", message: "มีฟีเจอร์ใหม่: รายงานยอดขายรายวัน", read: true, time: new Date(Date.now() - 60 * 60000) },
]

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)

  const unreadCount = notifications.filter(n => !n.read).length

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  const toast = {
    success: (message: string) => showToast("success", message),
    error: (message: string) => showToast("error", message),
    warning: (message: string) => showToast("warning", message),
    info: (message: string) => showToast("info", message),
  }

  const addNotification = useCallback((n: Omit<Notification, "id" | "read" | "time">) => {
    const notif: Notification = { ...n, id: Math.random().toString(36).slice(2), read: false, time: new Date() }
    setNotifications(prev => [notif, ...prev])
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ toasts, notifications, unreadCount, toast, addNotification, markAllRead, markRead, dismissToast }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error("useNotification must be used within NotificationProvider")
  return ctx
}
