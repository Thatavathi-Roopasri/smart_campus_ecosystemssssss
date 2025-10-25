import React from 'react';

const card = {
  background: '#fff',
  borderRadius: 12,
  padding: 20,
  boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
  border: '1px solid #eee'
};

const icon = {
  width: 72,
  height: 72,
  borderRadius: '50%',
  background: '#507687',
  display: 'grid',
  placeItems: 'center',
  color: '#FCFAEE',
  fontSize: 28,
  fontWeight: 700
};

export default function RoleSelect({ onPick }) {
  return (
    <div style={{maxWidth: 900, margin: '32px auto'}}>
      <h1 style={{textAlign: 'center', color: '#384B70', marginBottom: 8}}>Welcome to KLH Smart Campus</h1>
      <p style={{textAlign: 'center', color: '#507687', marginBottom: 24}}>Please select your role to continue</p>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20}}>
        <div style={card} onClick={() => onPick('student')}>
          <div style={icon}>S</div>
          <div style={{fontSize: 18, fontWeight: 700, color: '#384B70'}}>Student</div>
          <div style={{color: '#507687'}}>Access events, Track Vault, feedbacks</div>
        </div>
        <div style={card} onClick={() => onPick('hod')}>
          <div style={icon}>H</div>
          <div style={{fontSize: 18, fontWeight: 700, color: '#384B70'}}>HOD</div>
          <div style={{color: '#507687'}}>Review and resolve feedbacks</div>
        </div>
        <div style={card} onClick={() => onPick('admin')}>
          <div style={icon}>A</div>
          <div style={{fontSize: 18, fontWeight: 700, color: '#384B70'}}>Admin</div>
          <div style={{color: '#507687'}}>Manage events and Track Vault</div>
        </div>
      </div>
    </div>
  );
}
