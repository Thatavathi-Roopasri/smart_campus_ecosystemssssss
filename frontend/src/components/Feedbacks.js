import React, { useEffect, useState } from 'react';

const input = { padding:'10px 12px', borderRadius:8, border:'1px solid #e5e7eb' };
const btn = { background:'#507687', color:'#FCFAEE', padding:'10px 14px', borderRadius:8, border:'none', cursor:'pointer' };

export default function Feedbacks() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ subject:'', category:'other', description:'', imageData:'' });
  const [preview, setPreview] = useState('');

  const load = () => fetch('http://localhost:5000/api/feedbacks').then(r=>r.json()).then(setItems).catch(()=>setItems([]));
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
    await fetch('http://localhost:5000/api/feedbacks', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    setForm({ subject:'', category:'other', description:'', imageData:'' });
    setPreview('');
    setOpen(false);
    load();
  };

  return (
    <div style={{display:'grid', gap:16}}>
      <div style={{display:'flex', justifyContent:'flex-end'}}>
        <button onClick={()=>setOpen(true)} style={{...btn, background:'#384B70'}}>+ New Feedback</button>
      </div>

      {open && (
        <form onSubmit={submit} style={{background:'#fff', padding:16, borderRadius:12, boxShadow:'0 6px 14px rgba(0,0,0,0.06)', display:'grid', gap:12}}>
          <div style={{display:'flex', gap:12}}>
            <input placeholder="Subject" value={form.subject} onChange={(e)=>setForm({...form, subject:e.target.value})} style={{...input, flex:1}} />
            <select value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})} style={input}>
              <option value="marks">Marks</option>
              <option value="facilities">Facilities</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Administration</option>
              <option value="other">Other</option>
            </select>
          </div>
          <textarea placeholder="Describe your feedback or grievance" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} style={{...input, minHeight:120}} />
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <input type="file" accept="image/*" onChange={pickImg} />
            {preview && <img src={preview} alt="preview" style={{height:60, borderRadius:8}} />}
          </div>
          <div style={{display:'flex', gap:8}}>
            <button type="submit" style={btn}>Submit</button>
            <button type="button" onClick={()=>setOpen(false)} style={{...btn, background:'#9CA3AF'}}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{display:'grid', gap:12}}>
        {items.map(fb => (
          <div key={fb._id || fb.id} style={{background:'#fff', borderRadius:12, padding:12, boxShadow:'0 6px 14px rgba(0,0,0,0.06)'}}>
            <div style={{display:'flex', alignItems:'center', gap:8}}>
              <span style={{padding:'2px 8px', borderRadius:999, background:'#507687', color:'#FCFAEE', fontSize:12, fontWeight:700}}>{fb.category.toUpperCase()}</span>
              <strong style={{color:'#384B70'}}>{fb.subject}</strong>
              <span style={{color:'#6B7280', marginLeft:'auto', fontSize:12}}>{new Date(fb.createdAt).toLocaleString()}</span>
            </div>
            <div style={{color:'#6B7280', marginTop:6}}>{fb.description}</div>
            {fb.imageData && <img src={fb.imageData} alt="attachment" style={{marginTop:8, maxHeight:160, borderRadius:8}} />}
          </div>
        ))}
        {items.length === 0 && <div style={{color:'#6B7280'}}>No feedbacks yet.</div>}
      </div>
    </div>
  );
}
