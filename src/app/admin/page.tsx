import React from 'react'
import CMSLayout from '@/master_cms/components/CMSLayout'
import MainChart from '@/master_cms/components/MainChart'
import { FileText, Users, Eye, Plus } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <CMSLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--cms-text-secondary)', fontSize: '0.9rem' }}>Welcome back, here's what's happening today.</p>
        </div>
        <button className="cms-button-primary">
          <Plus size={18} />
          Create New Post
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="cms-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--cms-text-secondary)', fontWeight: 500 }}>Total Posts</span>
            <FileText size={20} color="var(--cms-accent)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>124</div>
          <div style={{ color: '#10b981', fontSize: '0.8rem', marginTop: '0.5rem' }}>+12% from last month</div>
        </div>
        <div className="cms-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--cms-text-secondary)', fontWeight: 500 }}>Total Users</span>
            <Users size={20} color="var(--cms-accent)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>1,240</div>
          <div style={{ color: '#10b981', fontSize: '0.8rem', marginTop: '0.5rem' }}>+5% from last month</div>
        </div>
        <div className="cms-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--cms-text-secondary)', fontWeight: 500 }}>Total Views</span>
            <Eye size={20} color="var(--cms-accent)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>45.2k</div>
          <div style={{ color: '#10b981', fontSize: '0.8rem', marginTop: '0.5rem' }}>+18% from last month</div>
        </div>
      </div>

      {/* Main Chart */}
      <div style={{ marginBottom: '2rem' }}>
        <MainChart />
      </div>

      {/* Recent Activity Mockup */}
      <div className="cms-card" style={{ minHeight: '300px' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--cms-border)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--cms-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                📝
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>Article "{i === 1 ? 'Next.js 16 Guide' : 'Supabase Tips'}" updated</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--cms-text-secondary)' }}>Modified by Admin • 5 mins ago</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CMSLayout>
  )
}
