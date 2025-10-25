import React, { useEffect, useState } from 'react';

const input = { padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#eaf1ff', outline: 'none', width: '100%' };
const btn = { background: '#507687', color: '#FCFAEE', border: 'none', padding: '10px 14px', borderRadius: 8, cursor: 'pointer', width: '100%', fontWeight: 600 };
const link = { color: '#384B70', cursor: 'pointer', textDecoration: 'underline' };

export default function AuthForm({ role = 'student', onLogin }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const signupDisabled = role === 'hod' || role === 'admin';

  const toggle = () => {
    const next = mode === 'signin' ? 'signup' : 'signin';
    setMode(next);
    setError('');
  };

  // Clear fields whenever mode changes to avoid any prefilled values
  useEffect(() => {
    setEmail('');
    setPassword('');
    if (mode === 'signup') setName('');
  }, [mode]);
  
  useEffect(() => {
    if (signupDisabled && mode === 'signup') {
      setMode('signin');
      setError('');
    }
  }, [signupDisabled, mode]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    if (!email.toLowerCase().endsWith('@klh.edu.in')) {
      setError('Only @klh.edu.in emails are allowed');
      return;
    }

    setLoading(true);
    try {
      const url = mode === 'signup' ? 'http://localhost:5000/api/auth/signup' : 'http://localhost:5000/api/auth/login';
      const body = mode === 'signup' ? { email, password, name, role } : { email, password };
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const text = await res.text();
      let data;
      try { data = text ? JSON.parse(text) : {}; } catch { data = null; }
      if (!res.ok) throw new Error((data && data.error) || text || `HTTP ${res.status}`);

      if (mode === 'signin') {
        onLogin && onLogin(data.user, data.token);
      } else {
        // After signup, switch to login mode
        setMode('signin');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = role === 'hod' ? 'HOD' : role === 'admin' ? 'Admin' : 'Student';

  return (
    <div style={{maxWidth: 420, margin: '40px auto', background: '#fff', borderRadius: 12, padding: 20, boxShadow:'0 10px 24px rgba(0,0,0,0.08)'}}>
      {!signupDisabled && (
        <div style={{marginBottom: 16, display:'flex', alignItems:'center', gap:8}}>
          <button type="button" onClick={()=>{ setMode('signin'); setError(''); }} style={{padding:'8px 12px', borderRadius:8, border:'1px solid #cbd5e1', background: mode==='signin' ? '#507687' : '#fff', color: mode==='signin' ? '#FCFAEE' : '#374151', cursor:'pointer', fontWeight:600}}>Sign in</button>
          <button type="button" onClick={()=>{ setMode('signup'); setError(''); }} style={{padding:'8px 12px', borderRadius:8, border:'1px solid #cbd5e1', background: mode==='signup' ? '#507687' : '#fff', color: mode==='signup' ? '#FCFAEE' : '#374151', cursor:'pointer', fontWeight:600}}>Sign up</button>
        </div>
      )}
      <h2 style={{margin:'4px 0 12px', color:'#384B70'}}>{mode === 'signin' ? `${roleLabel} Login` : `Create your ${roleLabel} account`}</h2>

      <form onSubmit={submit} style={{display:'grid', gap:12}}>
        {mode === 'signup' && (
          <input placeholder="Full name (optional)" value={name} onChange={(e)=>setName(e.target.value)} style={input} autoComplete="off" autoCorrect="off" spellCheck={false} />
        )}
        <input type="email" name="email" placeholder="Email (@klh.edu.in)" value={email} onChange={(e)=>setEmail(e.target.value)} style={input} autoComplete="off" autoCorrect="off" spellCheck={false} autoCapitalize="none" />
        <input type="password" name="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} style={input} autoComplete="new-password" />
        {error && <div style={{color:'#B8001F', fontSize:13}}>{error}</div>}
        <button type="submit" disabled={loading} style={{...btn, opacity: loading ? 0.7 : 1}}>{loading ? 'Please wait…' : (mode === 'signin' ? 'Login' : 'Create account')}</button>
      </form>
    </div>
  );
}
