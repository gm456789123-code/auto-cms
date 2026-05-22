"use client"

import React from 'react'
import { Users, Clock, CheckCircle, Trash2 } from 'lucide-react'
import { Table, TableStatus } from '@/types/pos'

interface TableCardProps {
  table: Table
  onClick: (table: Table) => void
  onDelete?: (table: Table) => void
}

function getElapsed(openedAt: string) {
  const diff = Math.floor((Date.now() - new Date(openedAt).getTime()) / 60000)
  return `${diff} นาที`
}

const statusConfig: Record<TableStatus, { label: string; bg: string; border: string; dot: string }> = {
  available: {
    label: 'ว่าง',
    bg: 'var(--cms-card-bg)',
    border: 'var(--cms-border)',
    dot: '#10b981',
  },
  occupied: {
    label: 'มีลูกค้า',
    bg: 'var(--cms-accent-soft)',
    border: 'var(--cms-accent)',
    dot: 'var(--cms-accent)',
  },
  billing: {
    label: 'รอชำระ',
    bg: 'rgba(245, 158, 11, 0.08)',
    border: '#f59e0b',
    dot: '#f59e0b',
  },
}

export default function TableCard({ table, onClick, onDelete }: TableCardProps) {
  const cfg = statusConfig[table.status]
  const canDelete = table.status === 'available' && onDelete

  return (
    <div
      onClick={() => onClick(table)}
      style={{
        background: cfg.bg,
        border: `2px solid ${cfg.border}`,
        borderRadius: '16px',
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        position: 'relative',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {canDelete && (
        <button
          onClick={e => { e.stopPropagation(); onDelete(table) }}
          title="ลบโต๊ะ"
          style={{
            position: 'absolute', top: '0.6rem', right: '0.6rem',
            width: 26, height: 26, borderRadius: '8px',
            border: '1px solid var(--cms-border)', background: 'var(--cms-card-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--cms-text-secondary)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--cms-danger)'
            e.currentTarget.style.color = 'var(--cms-danger)'
            e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--cms-border)'
            e.currentTarget.style.color = 'var(--cms-text-secondary)'
            e.currentTarget.style.background = 'var(--cms-card-bg)'
          }}
        >
          <Trash2 size={13} />
        </button>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>โต๊ะ {table.number}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 600, color: cfg.dot }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
          {cfg.label}
        </span>
      </div>

      {table.status !== 'available' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cms-text-secondary)', fontSize: '0.85rem' }}>
            <Users size={15} />
            <span>{table.people} คน</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cms-text-secondary)', fontSize: '0.85rem' }}>
            <Clock size={15} />
            <span>{table.openedAt ? getElapsed(table.openedAt) : '-'}</span>
          </div>
        </>
      )}

      {table.status === 'available' && (
        <div style={{ color: 'var(--cms-text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle size={15} color="#10b981" />
          <span>พร้อมรับลูกค้า</span>
        </div>
      )}
    </div>
  )
}
