import React, { useEffect, useState } from 'react';

const input = { padding:'10px 12px', borderRadius:8, border:'1px solid #e5e7eb' };
const btn = { background:'#507687', color:'#FCFAEE', padding:'10px 14px', borderRadius:8, border:'none', cursor:'pointer' };

export default function VoiceBox() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ content:'', imageData:'' });
  const [preview, setPreview] = useState('');

  const load = () => fetch('http://localhost:5000/api/voice').then(r=>r.json()).then(setItems).catch(()=>setItems([]));
  useEffect(() => { load(); }, []);

  const pickImg = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setForm(prev=>({...prev, imageData: reader.result})); setPreview(reader.result); };
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/voice', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    setForm({ content:'', imageData:'' });
    setPreview('');
    load();
  };

  return (
    <div style={{display:'grid', gap:16}}>
      <form onSubmit={submit} style={{background:'#fff', padding:16, borderRadius:12, boxShadow:'0 6px 14px rgba(0,0,0,0.06)', display:'grid', gap:12}}>
        <textarea placeholder="Share your anonymous suggestion or concern" value={form.content} onChange={(e)=>setForm({...form, content:e.target.value})} style={{...input, minHeight:100}} />
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <input type="file" accept="image/*" onChange={pickImg} />
          {preview && <img src={preview} alt="preview" style={{height:60, borderRadius:8}} />}
        </div>
        <button type="submit" style={btn}>Post</button>
      </form>

      <div style={{display:'grid', gap:12}}>
        {items.map(it => (
          <div key={it._id || it.id} style={{background:'#fff', borderRadius:12, padding:12, boxShadow:'0 6px 14px rgba(0,0,0,0.06)'}}>
            <div style={{display:'flex', gap:8, alignItems:'center'}}>
              <span style={{padding:'2px 8px', borderRadius:999, background:'#384B70', color:'#FCFAEE', fontSize:12, fontWeight:700}}>VOICE</span>
              <span style={{color:'#6B7280', marginLeft:'auto', fontSize:12}}>{new Date(it.createdAt).toLocaleString()}</span>
            </div>
            <div style={{color:'#374151', marginTop:6}}>{it.content}</div>
            {it.imageData && <img src={it.imageData} alt="attachment" style={{marginTop:8, maxHeight:160, borderRadius:8}} />}
          </div>
        ))}
        {items.length === 0 && <div style={{color:'#6B7280'}}>No posts yet.</div>}
      </div>
    </div>
  );
}
