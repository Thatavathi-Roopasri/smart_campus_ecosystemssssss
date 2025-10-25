import React, { useState } from 'react';

export default function LoginForm({ role, onLogin, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e) => {
    e.preventDefault();
    // Mock auth: just pass email and role to parent
    onLogin({ email: email || `${role}@klh.edu.in`, role });
  };

  return (
    <div style={{maxWidth: 420, margin: '48px auto', background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.08)'}}>
      <button onClick={onBack} style={{background: 'transparent', border: 'none', color: '#507687', cursor: 'pointer', marginBottom: 8}}>{'← Back'}</button>
      <h2 style={{margin: '4px 0 8px', color: '#384B70', textTransform: 'capitalize'}}>{role} Login</h2>
      <p style={{marginTop: 0, color: '#507687'}}>Enter your credentials to continue.</p>
      <form onSubmit={submit} style={{display: 'grid', gap: 12}}>
        <label style={{display: 'grid', gap: 6}}>
          <span style={{color: '#384B70'}}>Email</span>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder={`your.${role}@klh.edu.in`} style={{padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb'}} />
        </label>
        <label style={{display: 'grid', gap: 6}}>
          <span style={{color: '#384B70'}}>Password</span>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" style={{padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb'}} />
        </label>
        <button type="submit" style={{background: '#507687', color: '#FCFAEE', padding: '10px 14px', borderRadius: 8, border: 'none', cursor: 'pointer'}}>Login</button>
      </form>
    </div>
  );
}
