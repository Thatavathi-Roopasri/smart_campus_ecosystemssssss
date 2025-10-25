import React, { useEffect, useState } from 'react';

const card = { background:'#fff', borderRadius:12, padding:12, boxShadow:'0 6px 14px rgba(0,0,0,0.06)' };
const tag = { padding:'2px 8px', borderRadius:999, background:'#384B70', color:'#FCFAEE', fontSize:12, fontWeight:700 };

export default function HodComplaints() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:5000/api/feedbacks');
        const data = await res.json().catch(()=>[]);
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setError('Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div style={{display:'grid', gap:12}}>
      <h2 style={{margin:0, color:'#384B70'}}>Complaints (All Students)</h2>
      {loading && <div>Loading…</div>}
      {error && <div style={{color:'#B8001F'}}>{error}</div>}
      {!loading && items.length === 0 && <div style={{color:'#6B7280'}}>No complaints yet.</div>}
      {items.map(fb => (
        <div key={fb._id || fb.id} style={card}>
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <span style={tag}>{String(fb.category || 'other').toUpperCase()}</span>
            <strong style={{color:'#384B70'}}>{fb.subject}</strong>
            <span style={{color:'#6B7280', marginLeft:'auto', fontSize:12}}>{fb.createdAt ? new Date(fb.createdAt).toLocaleString() : ''}</span>
          </div>
          <div style={{color:'#6B7280', marginTop:6}}>{fb.description}</div>
          {fb.imageData && <img src={fb.imageData} alt="attachment" style={{marginTop:8, maxHeight:200, borderRadius:8}} />}
        </div>
      ))}
    </div>
  );
}
