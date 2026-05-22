"use client"

import React from 'react'
import { LayoutDashboard, FileText, Image as ImageIcon, Settings, LogOut, Sparkles, X } from 'lucide-react'
import styles from './Sidebar.module.css'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <button className={styles.closeBtn} onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Sparkles size={20} fill="currentColor" />
          </div>
          <span className={styles.logoText}>Master CMS</span>
          <span className={styles.version}>v1.0</span>
        </div>

        <nav className={styles.nav}>
          <div className={`${styles.navItem} ${styles.active}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div className={styles.navItem}>
            <FileText size={20} />
            <span>Posts</span>
          </div>
          <div className={styles.navItem}>
            <ImageIcon size={20} />
            <span>Media</span>
          </div>
          <div className={styles.navItem}>
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </nav>

        <div className={styles.footer}>
          <div className={`${styles.navItem} ${styles.logout}`}>
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </aside>
    </>
  )
}
