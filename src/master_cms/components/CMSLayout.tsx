"use client"

import React, { useState } from 'react'
import Sidebar from './Sidebar'
import TopNav from './TopNav'
import { CMSThemeProvider } from '../context/ThemeContext'
import '../styles/theme.css'

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <CMSThemeProvider>
      <div className="cms-body">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <TopNav onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="cms-main-content">
          {children}
        </main>

        <style jsx global>{`
          .cms-main-content {
            margin-left: 260px;
            padding-top: 70px;
            padding: 2rem;
            transition: margin 0.3s ease;
          }

          @media (max-width: 1024px) {
            .cms-main-content {
              margin-left: 0;
              padding: 1.5rem;
              padding-top: 85px;
            }
          }
        `}</style>
      </div>
    </CMSThemeProvider>
  )
}
