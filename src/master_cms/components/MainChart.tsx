"use client"

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { useCMSTheme } from '../context/ThemeContext'

const data = [
  { name: 'Mon', views: 4000, posts: 2400 },
  { name: 'Tue', views: 3000, posts: 1398 },
  { name: 'Wed', views: 2000, posts: 9800 },
  { name: 'Thu', views: 2780, posts: 3908 },
  { name: 'Fri', views: 1890, posts: 4800 },
  { name: 'Sat', views: 2390, posts: 3800 },
  { name: 'Sun', views: 3490, posts: 4300 },
]

export default function MainChart() {
  const { theme } = useCMSTheme()

  const accentColor = theme === 'light' ? '#3b82f6' : '#60a5fa'
  const gridColor = theme === 'light' ? '#e5e7eb' : '#27272a'
  const textColor = theme === 'light' ? '#6b7280' : '#9ca3af'

  return (
    <div className="cms-card" style={{ height: '400px', width: '100%', padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Content Statistics</h3>
        <p style={{ color: 'var(--cms-text-secondary)', fontSize: '0.85rem' }}>Activity from the past 7 days</p>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accentColor} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--cms-card-bg)',
              borderColor: 'var(--cms-border)',
              borderRadius: '12px',
              color: 'var(--cms-text-primary)'
            }}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke={accentColor}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorViews)"
            dot={{ r: 4, fill: accentColor, strokeWidth: 2, stroke: 'var(--cms-card-bg)' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
