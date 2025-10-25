import React, { useEffect, useState } from 'react';

export default function Events({ user }) {
  const [items, setItems] = useState([]);
  const [rolls, setRolls] = useState({}); // eventId -> input value
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState({}); // eventId -> true when sent

  useEffect(() => {
    fetch('http://localhost:5000/api/events').then(r=>r.json()).then(setItems).catch(()=>setItems([]));
  }, []);

  const sendInterest = async (id) => {
    const roll = (rolls[id] || '').trim();
    if (!roll) { setMsg('Please enter your roll number'); return; }
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}/interest`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ roll }) });
      if (!res.ok) throw new Error('Failed to submit');
      setMsg('');
      setSent(prev => ({ ...prev, [id]: true }));
      // refresh list to show updated counts
      const fresh = await fetch('http://localhost:5000/api/events').then(r=>r.json());
      setItems(Array.isArray(fresh) ? fresh : []);
      setRolls(prev => ({ ...prev, [id]: '' }));
    } catch {
      setMsg('Could not submit interest');
    }
  };

  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:16}}>
      {items.map(ev => (
        <div key={ev._id || ev.id} style={{background:'#fff', borderRadius:12, overflow:'hidden', boxShadow:'0 6px 14px rgba(0,0,0,0.06)'}}>
          {ev.posterUrl && <img src={ev.posterUrl} alt={ev.title} style={{width:'100%', height:160, objectFit:'cover'}} />}
          <div style={{padding:12}}>
            <div style={{fontWeight:700, color:'#384B70'}}>{ev.title}</div>
            <div style={{color:'#6B7280', fontSize:14, margin:'6px 0'}}>{ev.description}</div>
            <div style={{display:'flex', gap:8, color:'#507687', fontSize:13}}>
              <span>📍 {ev.venue}</span>
              <span>•</span>
              <span>🕒 {new Date(ev.startAt).toLocaleString()}</span>
            </div>
            {user?.role === 'student' && (
              <div style={{display:'grid', gap:6, marginTop:10}}>
                <div style={{display:'flex', gap:8}}>
                  <input placeholder="Your roll number" value={rolls[ev._id] || ''} onChange={(e)=>setRolls(prev=>({ ...prev, [ev._id]: e.target.value }))} style={{flex:1, padding:'8px 10px', borderRadius:8, border:'1px solid #e5e7eb', background:'#eef2ff'}} disabled={!!sent[ev._id]} />
                  <button onClick={()=>sendInterest(ev._id)} disabled={!!sent[ev._id]} style={{background: sent[ev._id] ? '#10B981' : '#507687', color:'#FCFAEE', border:'none', borderRadius:8, padding:'8px 12px', cursor:'pointer'}}>{sent[ev._id] ? 'Sent' : 'I’m interested'}</button>
                </div>
                {sent[ev._id] && <div style={{color:'#10B981', fontSize:13}}>Sent your roll number</div>}
              </div>
            )}
            {user?.role === 'hod' && ev.interestedRolls && ev.interestedRolls.length > 0 && (
              <div style={{marginTop:10, background:'#F3F4F6', borderRadius:8, padding:8}}>
                <div style={{fontWeight:700, color:'#384B70', marginBottom:4}}>Interested Roll Numbers</div>
                <div style={{fontSize:13, color:'#374151'}}>{ev.interestedRolls.join(', ')}</div>
              </div>
            )}
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div style={{color:'#6B7280'}}>No events yet.</div>
      )}
      {msg && <div style={{gridColumn:'1 / -1', color:'#507687'}}>{msg}</div>}
    </div>
  );
}
