"use client"

import React, { useState } from 'react'
import { Search, Bell, Sun, Moon, Info, Menu } from 'lucide-react'
import { useCMSTheme } from '../context/ThemeContext'
import styles from './TopNav.module.css'

interface TopNavProps {
  onMenuClick: () => void
}

export default function TopNav({ onMenuClick }: TopNavProps) {
  const { theme, toggleTheme } = useCMSTheme()
  const [showNoti, setShowNoti] = useState(false)

  return (
    <header className={styles.topnav}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className={styles.menuBtn} onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className={styles.search}>
          <Search size={18} className={styles.iconBtn} />
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.iconBtn} onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </div>

        <div className={styles.iconBtn} style={{ position: 'relative' }}>
          <Bell size={20} onClick={() => setShowNoti(!showNoti)} />
          <div className={styles.badge} />

          {showNoti && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownTitle}>Notifications</div>
              <div className={styles.notiItem}>
                <div className={styles.notiIcon}>
                  <Info size={18} color="var(--cms-accent)" />
                </div>
                <div className={styles.notiContent}>
                  <div className={styles.notiText}>ยินดีต้อนรับสู่ CMS ใหม่ของคุณ! 🎉</div>
                  <div className={styles.notiTime}>ตอนนี้</div>
                </div>
              </div>
              <div className={styles.notiItem}>
                <div className={styles.notiIcon}>
                  <Bell size={18} color="var(--cms-accent)" />
                </div>
                <div className={styles.notiContent}>
                  <div className={styles.notiText}>ระบบเชื่อมต่อ MySQL เรียบร้อยแล้ว</div>
                  <div className={styles.notiTime}>2 นาทีที่แล้ว</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.profile}>
          AD
        </div>
      </div>
    </header>
  )
}
