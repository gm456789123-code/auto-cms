"use client"

import React from "react"
import { SessionProvider } from "next-auth/react"
import { NotificationProvider } from "@/context/NotificationContext"
import { CMSThemeProvider } from "@/master_cms/context/ThemeContext"
import ToastContainer from "@/components/ui/Toast"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CMSThemeProvider>
        <NotificationProvider>
          {children}
          <ToastContainer />
        </NotificationProvider>
      </CMSThemeProvider>
    </SessionProvider>
  )
}
