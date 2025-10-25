import React from 'react';

export default function Sidebar({ user, tab, setTab }) {
  const menuByRole = {
    student: [
      { key: 'events', label: 'Events' },
      { key: 'trackvault', label: 'Track Vault' },
      { key: 'feedbacks', label: 'Feedbacks' },
      { key: 'voice', label: 'Voice Box' }
    ],
    hod: [
      { key: 'complaints', label: 'Complaints' },
      { key: 'events', label: 'Events' }
    ],
    admin: [
      { key: 'events', label: 'Manage Events' },
      { key: 'trackvault', label: 'Track Vault Admin' },
      { key: 'voice', label: 'Moderation' }
    ]
  };

  const items = menuByRole[user?.role] || [];

  return (
    <aside style={{
      width: 260,
      background: '#111827',
      color: '#E5E7EB',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      <div style={{display:'flex', alignItems:'center', gap:10, marginBottom: 12}}>
        <img
          src="/pic1.png"
          alt="KL University"
          loading="eager"
          decoding="async"
          onError={(e)=>{ e.currentTarget.style.visibility = 'hidden'; }}
          style={{width: 40, height: 40, objectFit: 'contain', flex: '0 0 auto'}}
        />
      </div>
      <div style={{display: 'flex', alignItems:'center', gap:12, marginBottom: 8}}>
        <div style={{width:40,height:40,borderRadius:'50%',background:'#507687',display:'grid',placeItems:'center',color:'#FCFAEE',fontWeight:700}}>
          {user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <div style={{display:'grid'}}>
          <strong style={{color:'#fff', fontSize: 14}}>Welcome, {user?.role?.toUpperCase()}</strong>
          <span style={{color:'#9CA3AF', fontSize: 12}}>{user?.email}</span>
        </div>
      </div>
      {items.map(i => (
        <button
          key={i.key}
          onClick={() => setTab(i.key)}
          style={{
            textAlign: 'left',
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid #1F2937',
            background: tab === i.key ? '#507687' : 'transparent',
            color: tab === i.key ? '#FCFAEE' : '#E5E7EB',
            cursor: 'pointer'
          }}
        >
          {i.label}
        </button>
      ))}
    </aside>
  );
}
